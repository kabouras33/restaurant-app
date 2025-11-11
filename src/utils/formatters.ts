import { format } from 'date-fns';

export const formatDate = (date: Date | string, formatStr: string = 'yyyy-MM-dd'): string => {
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return format(parsedDate, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount: number, currency: string = 'USD', locale: string = 'en-US'): string => {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return 'Invalid Amount';
  }
};

export const capitalizeText = (text: string): string => {
  if (!text) return '';
  try {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  } catch (error) {
    console.error('Error capitalizing text:', error);
    return text;
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  try {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  } catch (error) {
    console.error('Error truncating text:', error);
    return text;
  }
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  try {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  } catch (error) {
    console.error('Error formatting phone number:', error);
    return phoneNumber;
  }
};