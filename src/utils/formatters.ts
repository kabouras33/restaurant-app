import { format } from 'date-fns';

export const formatDate = (date: Date | string, formatString: string = 'PP'): string => {
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(parsedDate.getTime())) throw new Error('Invalid date');
    return format(parsedDate, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount: number, currency: string = 'USD', locale: string = 'en-US'): string => {
  try {
    if (isNaN(amount)) throw new Error('Invalid amount');
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return 'Invalid Amount';
  }
};

export const capitalizeText = (text: string): string => {
  try {
    if (typeof text !== 'string') throw new Error('Invalid text');
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  } catch (error) {
    console.error('Error capitalizing text:', error);
    return '';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  try {
    if (typeof text !== 'string' || isNaN(maxLength)) throw new Error('Invalid input');
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  } catch (error) {
    console.error('Error truncating text:', error);
    return '';
  }
};