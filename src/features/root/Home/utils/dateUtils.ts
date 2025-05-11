/**
 * Formats a date into a human-readable string with weekday, month, and day
 * @param date - Date object to format
 * @returns Formatted date string (e.g. "Wed, Dec 15")
 */
export const formatDateString = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Formats a time into a human-readable string with hours and minutes
 * @param date - Date object to format
 * @returns Formatted time string (e.g. "03:45 PM")
 */
export const formatTimeString = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Formats a relative time (how much time until a meeting starts)
 * @param startTime - Starting time as Date object
 * @returns Human readable time description (e.g. "2 hours", "5 minutes", etc.)
 */
export const formatMeetingTime = (startTime: Date | null): string => {
  if (!startTime) return "N/A";
  
  const now = new Date();
  const diffMs = startTime.getTime() - now.getTime();
  
  if (diffMs <= 0) return "Starting now";
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  if (diffHours > 0) return `about ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
  return "less than a minute";
}; 