/**
 * Safely parse a date string to avoid timezone issues
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date} - Date object in local timezone
 */
export const parseLocalDate = (dateString) => {
  if (!dateString) return null;
  
  // If it's already a valid date string with time, use it
  if (dateString.includes('T')) {
    return new Date(dateString);
  }
  
  // Otherwise, append T00:00:00 to treat it as local time
  return new Date(dateString + 'T00:00:00');
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
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};
