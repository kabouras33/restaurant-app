import { format as formatDate, parseISO } from 'date-fns';

export const formatCurrency = (amount: number, currency: string = 'USD', locale: string = 'en-US'): string => {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return amount.toFixed(2); // Fallback to a simple fixed decimal format
  }
};

export const formatDateToLocale = (dateString: string, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string => {
  try {
    const date = parseISO(dateString);
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Fallback to the original date string
  }
};

export const capitalizeText = (text: string): string => {
  try {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  } catch (error) {
    console.error('Error capitalizing text:', error);
    return text; // Fallback to the original text
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  try {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  } catch (error) {
    console.error('Error truncating text:', error);
    return text; // Fallback to the original text
  }
};

export const formatPercentage = (value: number, locale: string = 'en-US', decimals: number = 2): string => {
  try {
    return new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return (value * 100).toFixed(decimals) + '%'; // Fallback to a simple percentage format
  }
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  try {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber; // Return the original if it doesn't match
  } catch (error) {
    console.error('Error formatting phone number:', error);
    return phoneNumber; // Fallback to the original phone number
  }
};

export const formatDateRange = (startDate: string, endDate: string, locale: string = 'en-US'): string => {
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const formattedStart = new Intl.DateTimeFormat(locale).format(start);
    const formattedEnd = new Intl.DateTimeFormat(locale).format(end);
    return `${formattedStart} - ${formattedEnd}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return `${startDate} - ${endDate}`; // Fallback to the original date strings
  }
};

export default {
  formatCurrency,
  formatDateToLocale,
  capitalizeText,
  truncateText,
  formatPercentage,
  formatPhoneNumber,
  formatDateRange,
};