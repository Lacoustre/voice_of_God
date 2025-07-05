export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
};

export const validateNumber = (number) => {
  return !isNaN(number) && number.toString().trim() !== '';
};

export const formatPhoneNumber = (phone) => {
  return phone.replace(/[^0-9+\-\s()]/g, '');
};