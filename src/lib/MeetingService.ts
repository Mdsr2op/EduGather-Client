import { Socket } from 'socket.io-client';

/**
 * Service to manage meeting tracking outside of the meeting room component.
 * This ensures meetings properly end even if all users leave the interface.
 */
export class MeetingService {
  private static instance: MeetingService;
  private activeMeetings: Map<string, { 
    timeoutId: NodeJS.Timeout;
    endTime: Date;
  }> = new Map();

  /**
   * Gets the singleton instance of MeetingService
   */
  public static getInstance(): MeetingService {
    if (!MeetingService.instance) {
      MeetingService.instance = new MeetingService();
    }
    return MeetingService.instance;
  }

  /**
   * Track a meeting and ensure it ends at the given end time
   * @param meetingId The meeting ID to track
   * @param startTime When the meeting started
   * @param maxDurationSeconds Maximum duration in seconds
   * @param socket Socket.io client instance
   * @param onMeetingEnded Callback when meeting ends
   * @returns Cleanup function to stop tracking
   */
  public trackMeeting(
    meetingId: string,
    startTime: Date,
    maxDurationSeconds: number,
    socket: Socket | null,
    onMeetingEnded?: () => void
  ): () => void {
    // Calculate when the meeting should end
    const endTime = new Date(startTime.getTime() + (maxDurationSeconds * 1000));
    
    // Calculate remaining time
    const remainingTime = endTime.getTime() - Date.now();
    
    // Clear any existing timeout for this meeting
    this.cleanupMeeting(meetingId);
    
    // Only set timeout if there's remaining time
    if (remainingTime > 0) {
      console.log(`Tracking meeting ${meetingId} - will end in ${Math.round(remainingTime/1000)} seconds`);
      
      // Set a timeout to end the meeting when max duration is reached
      const timeoutId = setTimeout(() => {
        console.log(`Meeting ${meetingId} has reached max duration, ending...`);
        
        // Emit meeting end event to update status
        if (socket) {
          socket.emit("meetingEnded", { meetingId });
          
          // Update the meeting status in the database
          socket.emit("updateMeetingStatus", {
            meetingId,
            status: "ended",
            endTime: new Date().toISOString(),
            reason: "max_duration_reached"
          });
          
          // Also emit a meetingStatusChanged event for real-time UI updates
          socket.emit("meetingStatusChanged", {
            meetingId,
            status: "ended",
            endTime: new Date().toISOString()
          });
        }
        
        // Remove from tracked meetings
        this.activeMeetings.delete(meetingId);
        
        // Execute callback if provided
        if (onMeetingEnded) {
          onMeetingEnded();
        }
      }, remainingTime);
      
      // Store the timeout ID and end time
      this.activeMeetings.set(meetingId, { 
        timeoutId, 
        endTime 
      });
      
      // Return cleanup function
      return () => this.cleanupMeeting(meetingId);
    }
    
    return () => {}; // Return empty cleanup function if no timeout was set
  }
  
  /**
   * Stop tracking a meeting
   * @param meetingId The meeting ID to stop tracking
   */
  public cleanupMeeting(meetingId: string): void {
    const meeting = this.activeMeetings.get(meetingId);
    if (meeting) {
      clearTimeout(meeting.timeoutId);
      this.activeMeetings.delete(meetingId);
      console.log(`Stopped tracking meeting ${meetingId}`);
    }
  }
  
  /**
   * Get all currently tracked meetings
   * @returns Array of meeting IDs and their end times
   */
  public getTrackedMeetings(): { meetingId: string, endTime: Date }[] {
    return Array.from(this.activeMeetings.entries())
      .map(([meetingId, data]) => ({
        meetingId,
        endTime: data.endTime
      }));
  }
}

export default MeetingService.getInstance(); 