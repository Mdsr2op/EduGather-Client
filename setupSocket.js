import Message from "./models/message.model.js";
import Attachment from "./models/attachment.model.js";
import { sendMessageToKafka } from './config/kafka.config.js';

export function setupSocket(io) {
    // Track online users by channel
    const onlineUsers = new Map();
    
    // Track active meeting participants by meetingId and userId
    const activeMeetingParticipants = new Map();
    
    // Track active meetings by channelId
    const activeChannelMeetings = new Map();
    
    // Middleware for channel-based authentication
    io.use((socket, next) => {
        const channelId = socket.handshake.auth.channelId;
        const userId = socket.handshake.auth.userId;
        
        // Only apply middleware for channel-based connections
        if (socket.handshake.auth.type === 'channel') {
            if (!channelId) {
                return next(new Error("Channel ID is required"));
            }
            
            if (!userId) {
                return next(new Error("User ID is required"));
            }
            
            socket.channelId = channelId;
            socket.userId = userId;
        }
        
        next();
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        
        // Add the onAny listener
        socket.onAny((event, ...args) => {
            console.log(`Received event: ${event}`, args);
        });

        // Handle channel-based functionality if this is a channel connection
        if (socket.handshake.auth.type === 'channel') {
            // Join the channel room
            socket.join(socket.channelId);
            
            // Update online users for this channel
            if (!onlineUsers.has(socket.channelId)) {
                onlineUsers.set(socket.channelId, new Set());
            }
            onlineUsers.get(socket.channelId).add(socket.userId);
            
            // Broadcast user joined to channel
            io.to(socket.channelId).emit("user_presence", {
                channelId: socket.channelId,
                onlineUsers: Array.from(onlineUsers.get(socket.channelId)),
                action: "joined"
            });
            
            // Check if there's an active meeting in a channel
            socket.on("checkActiveMeetingsInChannel", (data, callback) => {
                try {
                    const { channelId } = data;
                    if (!channelId) {
                        callback({ active: false });
                        return;
                    }
                    
                    // Get the active meeting in this channel, if any
                    if (activeChannelMeetings.has(channelId)) {
                        const activeMeeting = activeChannelMeetings.get(channelId);
                        callback({ 
                            active: true, 
                            meetingId: activeMeeting.meetingId,
                            startedAt: activeMeeting.startedAt 
                        });
                    } else {
                        callback({ active: false });
                    }
                } catch (error) {
                    console.error("Error checking active meetings:", error);
                    callback({ active: false, error: "Failed to check active meetings" });
                }
            });
            
            // Set a meeting as active in a channel
            socket.on("setActiveMeetingInChannel", (data) => {
                try {
                    const { channelId, meetingId, active } = data;
                    if (!channelId || !meetingId) return;
                    
                    if (active) {
                        // Set this meeting as active in the channel
                        activeChannelMeetings.set(channelId, {
                            meetingId,
                            startedAt: new Date()
                        });
                        console.log(`Meeting ${meetingId} set as active in channel ${channelId}`);
                    } else {
                        // If this specific meeting is active in the channel, remove it
                        if (activeChannelMeetings.has(channelId)) {
                            const currentMeeting = activeChannelMeetings.get(channelId);
                            if (currentMeeting && currentMeeting.meetingId === meetingId) {
                                activeChannelMeetings.delete(channelId);
                                console.log(`Meeting ${meetingId} removed as active from channel ${channelId}`);
                            }
                        }
                    }
                    
                    // Notify all clients in the channel about the meeting status change
                    io.to(channelId).emit("meetingStatusChanged", {
                        channelId,
                        meetingId,
                        status: active ? "ongoing" : "ended"
                    });
                } catch (error) {
                    console.error("Error setting active meeting in channel:", error);
                }
            });
            
             // For tracking when a participant joins a meeting
             socket.on("joinedMeeting", (data) => {
                try {
                    const { meetingId, sessionId } = data;
                    if (!meetingId || !sessionId) return;
                    
                    const userId = socket.userId;
                    const participantKey = `${meetingId}:${userId}`;
                    
                    // Initialize if needed
                    if (!activeMeetingParticipants.has(participantKey)) {
                        activeMeetingParticipants.set(participantKey, {
                            sessions: new Map(),
                            latestTimestamp: Date.now()
                        });
                    }
                    
                    const participantData = activeMeetingParticipants.get(participantKey);
                    const currentTime = Date.now();
                    
                    // Track this session
                    participantData.sessions.set(sessionId, {
                        socketId: socket.id,
                        timestamp: currentTime
                    });
                    
                    participantData.latestTimestamp = currentTime;
                    activeMeetingParticipants.set(participantKey, participantData);
                    
                    console.log(`User ${userId} joined meeting ${meetingId} with session ${sessionId}`);
                    
                    // If there are multiple sessions for this user, keep only the latest
                    if (participantData.sessions.size > 1) {
                        // Find the latest session
                        let latestSession = sessionId;
                        let latestTimestamp = currentTime;
                        
                        participantData.sessions.forEach((session, sid) => {
                            if (session.timestamp > latestTimestamp) {
                                latestTimestamp = session.timestamp;
                                latestSession = sid;
                            }
                        });
                        
                        // Kick all sessions except the latest
                        participantData.sessions.forEach((session, sid) => {
                            if (sid !== latestSession) {
                                console.log(`Auto-kicking older session ${sid} for user ${userId} in meeting ${meetingId}`);
                                
                                // For the session being kicked, tell it to leave immediately
                                io.to(session.socketId).emit("duplicateSessionKicked", { 
                                    sessionId: sid,
                                    meetingId,
                                    userId: userId,
                                    reason: "A newer session has joined this meeting",
                                    action: "leave_immediately"
                                });
                                
                                // Also notify the newer session about the duplicate, so it can handle display
                                io.to(participantData.sessions.get(latestSession).socketId).emit(
                                    "removeOldParticipantSession", {
                                        sessionId: sid,
                                        meetingId,
                                        userId: userId,
                                        oldSocketId: session.socketId
                                    }
                                );
                                
                                participantData.sessions.delete(sid);
                            }
                        });
                        
                        activeMeetingParticipants.set(participantKey, participantData);
                    }
                } catch (error) {
                    console.error("Error handling joined meeting:", error);
                }
            });
            
            
            // For tracking when a participant leaves a meeting
            socket.on("leftMeeting", (data) => {
                try {
                    const { meetingId, sessionId } = data;
                    if (!meetingId || !sessionId) return;
                    
                    const userId = socket.userId;
                    const participantKey = `${meetingId}:${userId}`;
                    
                    if (activeMeetingParticipants.has(participantKey)) {
                        const participantData = activeMeetingParticipants.get(participantKey);
                        
                        // Remove this session
                        if (participantData.sessions.has(sessionId)) {
                            participantData.sessions.delete(sessionId);
                            console.log(`User ${userId} removed session ${sessionId} from meeting ${meetingId}`);
                            
                            // If no more sessions, clean up
                            if (participantData.sessions.size === 0) {
                                activeMeetingParticipants.delete(participantKey);
                            } else {
                                activeMeetingParticipants.set(participantKey, participantData);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error handling left meeting:", error);
                }
            });

            // For mic rotation - scoped to the specific channel
            socket.on("rotateMicStatus", (data) => {
                // Broadcast to all clients in the channel except the sender
                io.to(socket.channelId).emit("rotateMicStatus", data);
            });

            // For meeting ended notification
            socket.on("meetingEnded", async (data) => {
                try {
                    // Update the meeting status in the database if meetingId is provided
                    if (data && data.meetingId) {
                        const attachments = await Attachment.find({
                            "meetingData.meetingId": data.meetingId
                        });

                        for (const attachment of attachments) {
                            if (attachment.meetingData) {
                                attachment.meetingData.status = 'ended';
                                attachment.meetingData.endTime = new Date();
                                
                                if (data.participantsCount !== undefined) {
                                    attachment.meetingData.participantsCount = data.participantsCount;
                                }
                                
                                await attachment.save();
                                
                                // Find and update associated message
                                const message = await Message.findOne({ attachment: attachment._id })
                                    .populate('senderId', 'username avatar')
                                    .populate('attachment');
                                
                                if (message) {
                                    io.to(socket.channelId).emit("message_updated", message);
                                }
                            }
                        }
                        
                        // Clean up any participants in this meeting
                        const meetingPrefix = `${data.meetingId}:`;
                        for (const key of activeMeetingParticipants.keys()) {
                            if (key.startsWith(meetingPrefix)) {
                                activeMeetingParticipants.delete(key);
                            }
                        }
                        
                        // Remove this meeting as active in any channel
                        for (const [channelId, meeting] of activeChannelMeetings.entries()) {
                            if (meeting.meetingId === data.meetingId) {
                                activeChannelMeetings.delete(channelId);
                                
                                // Notify channel that the meeting is no longer active
                                io.to(channelId).emit("meetingStatusChanged", {
                                    channelId,
                                    meetingId: data.meetingId,
                                    status: "ended"
                                });
                                
                                console.log(`Meeting ${data.meetingId} removed as active from channel ${channelId} due to meeting end`);
                            }
                        }
                    }
                    
                    // Broadcast to all clients in the channel
                    io.to(socket.channelId).emit("meetingEnded", data || {});
                } catch (error) {
                    console.error("Error handling meeting ended:", error);
                    socket.emit("error", { message: "Failed to process meeting ended event" });
                }
            });

            // Handle updating meeting status
            socket.on("updateMeetingStatus", async (data) => {
                try {
                    // Find all attachments with this meeting ID
                    const attachments = await Attachment.find({
                        "meetingData.meetingId": data.meetingId
                    });

                    if (attachments.length === 0) {
                        console.log("No attachments found with this meeting ID:", data.meetingId);
                        return;
                    }

                    // Update each attachment with the new status
                    for (const attachment of attachments) {
                        if (attachment.meetingData) {
                            attachment.meetingData.status = data.status;
                            
                            // Update end time if provided
                            if (data.endTime) {
                                attachment.meetingData.endTime = data.endTime;
                            }
                            
                            // Update participants count if provided
                            if (data.participantsCount !== undefined) {
                                attachment.meetingData.participantsCount = data.participantsCount;
                            }
                            
                            await attachment.save();
                            
                            // Find the message associated with this attachment
                            const message = await Message.findOne({ attachment: attachment._id })
                                .populate('senderId', 'username avatar')
                                .populate('attachment');
                            
                            if (message) {
                                // Broadcast the updated message
                                io.to(socket.channelId).emit("message_updated", message);
                            }
                        }
                    }
                    
                    // If the status is "ongoing", set this meeting as active in the channel
                    if (data.status === "ongoing" && data.meetingId) {
                        activeChannelMeetings.set(socket.channelId, {
                            meetingId: data.meetingId,
                            startedAt: new Date()
                        });
                        
                        // Notify all clients in the channel
                        io.to(socket.channelId).emit("meetingStatusChanged", {
                            channelId: socket.channelId,
                            meetingId: data.meetingId,
                            status: "ongoing"
                        });
                        
                        console.log(`Meeting ${data.meetingId} set as active in channel ${socket.channelId} due to status update`);
                    } 
                    // If the status is "ended", remove this meeting as active in the channel
                    else if (data.status === "ended" && data.meetingId) {
                        if (activeChannelMeetings.has(socket.channelId)) {
                            const activeMeeting = activeChannelMeetings.get(socket.channelId);
                            if (activeMeeting.meetingId === data.meetingId) {
                                activeChannelMeetings.delete(socket.channelId);
                                
                                // Notify all clients in the channel
                                io.to(socket.channelId).emit("meetingStatusChanged", {
                                    channelId: socket.channelId,
                                    meetingId: data.meetingId,
                                    status: "ended"
                                });
                                
                                console.log(`Meeting ${data.meetingId} removed as active from channel ${socket.channelId} due to status update`);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error updating meeting status:", error);
                    socket.emit("error", { message: "Failed to update meeting status" });
                }
            });

            // Handle new message (updated to handle meeting attachments)
            socket.on("message", async (data) => {
                try {
                    const messageData = {
                        channelId: socket.channelId,
                        senderId: socket.userId,
                        content: data.content,
                        mentions: data.mentions || [],
                        replyTo: data.replyTo || null
                    };

                    // Handle attachment if present
                    if (data.attachment) {
                        // First create the Attachment document
                        const attachment = new Attachment({
                            url: data.attachment.url || `/${socket.channelId}/meeting/${data.attachment.meetingData?.meetingId || ''}`,
                            publicId: data.attachment.meetingData?.meetingId || Date.now().toString(),
                            fileType: data.attachment.fileType || 'application/meeting',
                            fileName: data.attachment.fileName || 'Meeting',
                            size: data.attachment.size || 0,
                            channelId: socket.channelId,
                            uploadedBy: socket.userId,
                            tags: ['meeting'],
                            type: 'meeting',
                            meetingData: {
                                meetingId: data.attachment.meetingData?.meetingId,
                                title: data.attachment.meetingData?.title || data.attachment.fileName || 'Meeting',
                                startTime: data.attachment.meetingData?.startTime || new Date(),
                                status: data.attachment.meetingData?.status || 'scheduled',
                                participantsCount: data.attachment.meetingData?.participantsCount || 0
                            }
                        });

                        await attachment.save();
                        
                        // Now set the attachment ID in the message data
                        messageData.attachment = attachment._id;
                    }

                    const message = new Message(messageData);

                    await message.save();
                    await message.populate('senderId', 'username avatar');
                    if (message.replyTo) {
                        await message.populate('replyTo.senderId', 'username');
                    }
                    if (message.attachment) {
                        await message.populate('attachment');
                    }

                    // Broadcast to everyone in the channel including sender
                    io.to(socket.channelId).emit("message", message);
                    console.log("Message broadcasted to channel:", socket.channelId);
                } catch (error) {
                    console.error("Error handling new message:", error);
                    socket.emit("error", { message: "Failed to send message" });
                }
            });

            // Handle new message
            socket.on("new_message", async (data) => {
                try {
                    const messageData = {
                        channelId: socket.channelId,
                        senderId: data.senderId,
                        content: data.content,
                        mentions: data.mentions || [],
                        replyTo: data.replyTo || null
                    };
                    
                    // Broadcast to everyone in the channel including sender
                    // The actual database save will be handled by the Kafka consumer
                    io.to(socket.channelId).emit("message", {
                        ...messageData,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    // Send message to Kafka
                    await sendMessageToKafka(messageData);
                    console.log("Message sent to Kafka and broadcasted to channel:", socket.channelId);
                } catch (error) {
                    console.error("Error handling new message:", error);
                    socket.emit("error", { message: "Failed to send message" });
                }
            });

            // Handle message edit
            socket.on("edit_message", async (data) => {
                try {
                    const message = await Message.findById(data.messageId);
                    if (!message) {
                        socket.emit("error", { message: "Message not found" });
                        return;
                    }

                    message.content = data.content;
                    message.mentions = data.mentions || message.mentions;
                    message.updatedAt = new Date();

                    await message.save();
                    await message.populate('senderId', 'username avatar');

                    io.to(socket.channelId).emit("message_updated", message);
                } catch (error) {
                    console.error("Error handling message edit:", error);
                    socket.emit("error", { message: "Failed to edit message" });
                }
            });

            // Handle message delete
            socket.on("delete_message", async (data) => {
                try {
                    const message = await Message.findById(data.messageId);
                    if (!message) {
                        socket.emit("error", { message: "Message not found" });
                        return;
                    }

                    message.deletedAt = new Date();
                    await message.save();

                    io.to(socket.channelId).emit("message_deleted", { messageId: data.messageId });
                } catch (error) {
                    console.error("Error handling message delete:", error);
                    socket.emit("error", { message: "Failed to delete message" });
                }
            });

            // Handle message pin
            socket.on("pin_message", async (data) => {
                try {
                    const message = await Message.findById(data.messageId);
                    if (!message) {
                        socket.emit("error", { message: "Message not found" });
                        return;
                    }

                    message.pinned = true;
                    message.pinnedBy = data.userId;
                    await message.save();
                    await message.populate('senderId', 'username avatar');
                    await message.populate('pinnedBy', 'username');

                    io.to(socket.channelId).emit("message_pinned", message);
                } catch (error) {
                    console.error("Error handling message pin:", error);
                    socket.emit("error", { message: "Failed to pin message" });
                }
            });

            // Handle message unpin
            socket.on("unpin_message", async (data) => {
                try {
                    const message = await Message.findById(data.messageId);
                    if (!message) {
                        socket.emit("error", { message: "Message not found" });
                        return;
                    }

                    message.pinned = false;
                    message.pinnedBy = null;
                    await message.save();
                    await message.populate('senderId', 'username avatar');

                    io.to(socket.channelId).emit("message_unpinned", message);
                } catch (error) {
                    console.error("Error handling message unpin:", error);
                    socket.emit("error", { message: "Failed to unpin message" });
                }
            });
            
            // Handle typing indicators
            socket.on("typing_start", (data) => {
                socket.to(socket.channelId).emit("user_typing", {
                    userId: socket.userId,
                    username: data.username,
                    isTyping: true
                });
            });
            
            socket.on("typing_end", (data) => {
                socket.to(socket.channelId).emit("user_typing", {
                    userId: socket.userId,
                    username: data.username,
                    isTyping: false
                });
            });
            
            // Notification for new message with attachments (after REST upload)
            socket.on("attachment_message_created", async (data) => {
                try {
                    // Find the message that was just created via REST API
                    const message = await Message.findById(data.messageId)
                        .populate('senderId', 'username avatar')
                        .populate('attachment');
                    
                    if (!message) {
                        socket.emit("error", { message: "Message with attachment not found" });
                        return;
                    }
                    
                    // Broadcast to everyone in the channel about the new message with attachment
                    io.to(socket.channelId).emit("message_with_attachment", message);
                } catch (error) {
                    console.error("Error handling attachment message notification:", error);
                    socket.emit("error", { message: "Failed to notify about attachment message" });
                }
            });
        }

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            
            // Only handle channel-based disconnection for channel type connections
            if (socket.handshake.auth.type === 'channel' && socket.channelId) {
                // Remove user from online users
                if (onlineUsers.has(socket.channelId)) {
                    onlineUsers.get(socket.channelId).delete(socket.userId);
                    
                    // Broadcast user left to channel
                    io.to(socket.channelId).emit("user_presence", {
                        channelId: socket.channelId,
                        onlineUsers: Array.from(onlineUsers.get(socket.channelId)),
                        action: "left"
                    });
                    
                    // Clean up empty channels
                    if (onlineUsers.get(socket.channelId).size === 0) {
                        onlineUsers.delete(socket.channelId);
                    }
                }
                
                // Also clean up any meeting sessions this socket was associated with
                const userId = socket.userId;
                
                // Search through all participant keys for this socket ID
                for (const [participantKey, participantData] of activeMeetingParticipants.entries()) {
                    let sessionsRemoved = false;
                    
                    // Check each session to see if it belongs to this socket
                    for (const [sessionId, sessionData] of participantData.sessions.entries()) {
                        if (sessionData.socketId === socket.id) {
                            participantData.sessions.delete(sessionId);
                            console.log(`Removed session ${sessionId} for participant ${participantKey} due to disconnect`);
                            sessionsRemoved = true;
                        }
                    }
                    
                    // If we removed sessions and there are none left, clean up
                    if (sessionsRemoved && participantData.sessions.size === 0) {
                        activeMeetingParticipants.delete(participantKey);
                    } else if (sessionsRemoved) {
                        activeMeetingParticipants.set(participantKey, participantData);
                    }
                }
            }
        });
    });
}
