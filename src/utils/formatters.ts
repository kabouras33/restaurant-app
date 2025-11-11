import { format } from 'date-fns';

export const formatDate = (date: Date | string, formatStr: string = 'MMMM dd, yyyy'): string => {
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
  try {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  } catch (error) {
    console.error('Error capitalizing text:', error);
    return '';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  try {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  } catch (error) {
    console.error('Error truncating text:', error);
    return text;
  }
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  try {
    return `${(value * 100).toFixed(decimals)}%`;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return 'Invalid Percentage';
  }
};

export const parseJSON = <T>(jsonString: string): T | null => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
};