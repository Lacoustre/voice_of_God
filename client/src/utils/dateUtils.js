/**
 * Safely parse a date string to avoid timezone issues
 * @param {string} dateString - Date string in YYYY-MM-DD or ISO format
 * @returns {Date} - Date object in local timezone
 */
export const parseLocalDate = (dateString) => {
  if (!dateString) return null;
  
  // If it's an ISO datetime string, extract just the date part
  if (dateString.includes('T')) {
    const datePart = dateString.split('T')[0];
    return new Date(datePart + 'T12:00:00');
  }
  
  // Otherwise, append T12:00:00 to treat it as local noon
  return new Date(dateString + 'T12:00:00');
};

/**
 * Format a date string for display
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const date = parseLocalDate(dateString);
  
  if (!date || isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  const defaultOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Check if a date is in the future
 * @param {string} dateString - Date string in YYYY-MM-DD or ISO format
 * @returns {boolean} - True if date is today or in the future
 */
export const isUpcomingDate = (dateString) => {
  const eventDate = parseLocalDate(dateString);
  if (!eventDate || isNaN(eventDate.getTime())) {
    return false;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  
  return eventDate >= today;
};
