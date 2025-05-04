/**
 * Utility functions for formatting message objects
 */

/**
 * Format a message for the Redux store
 */
export const formatMessageForStore = (message: any) => {
  return {
    _id: message._id,
    content: message.content,
    senderId: typeof message.senderId === 'object' 
      ? message.senderId 
      : { _id: message.senderId, username: 'User' },
    channelId: message.channelId,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    pinned: message.pinned || false,
    pinnedBy: message.pinnedBy,
    mentions: message.mentions || [],
    replyTo: message.replyTo || null,
    attachment: message.attachment || null,
    forwardedFrom: message.forwardedFrom || null,
    deletedAt: message.deletedAt || null
  };
};

/**
 * Format a message for UI display
 */
export const formatMessageForUI = (message: any) => {
  const formattedMessage: any = {
    id: message._id,
    text: message.content,
    senderId: typeof message.senderId === 'object' ? message.senderId._id : message.senderId,
    senderName: typeof message.senderId === 'object' ? message.senderId.username : 'User',
    timestamp: new Date(message.createdAt).getTime(),
    pinned: message.pinned || false,
    updatedAt: message.updatedAt,
    createdAt: message.createdAt,
    deletedAt: message.deletedAt || null
  };
  
  // Add forwardedFrom information if available
  if (message.forwardedFrom) {
    formattedMessage.forwardedFrom = {
      messageId: message.forwardedFrom.messageId,
      channelId: message.forwardedFrom.channelId,
      senderId: message.forwardedFrom.senderId
    };
  }
  
  // Add reply information if available
  if (message.replyTo && message.replyTo.messageId) {
    formattedMessage.replyTo = {
      id: message.replyTo.messageId,
      text: message.replyTo.content || '',
      senderId: message.replyTo.senderId._id || '',
      senderName: message.replyTo.senderId.username || 'User'
    };
  }
  
  // Add attachment information if available
  if (message.attachment) {
    formattedMessage.attachment = {
      id: message.attachment._id,
      url: message.attachment.url,
      fileType: message.attachment.fileType,
      fileName: message.attachment.fileName,
      size: message.attachment.size,
      type: message.attachment.type,
      meetingData: message.attachment.meetingData
    };
  }
  
  return formattedMessage;
}; 