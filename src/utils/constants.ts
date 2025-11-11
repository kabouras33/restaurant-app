import { PaymentMethod } from '@stripe/stripe-js';

export const API_ENDPOINTS = {
  AUTH: '/auth',
  INVENTORY: '/inventory',
  RESERVATIONS: '/reservations',
  PAYMENTS: '/payments',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error, please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access to this resource is forbidden.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in.',
  LOGOUT_SUCCESS: 'Successfully logged out.',
  RESERVATION_CREATED: 'Reservation created successfully.',
  PAYMENT_SUCCESS: 'Payment processed successfully.',
};

export const PAYMENT_OPTIONS: PaymentMethod[] = [
  { id: 'card', label: 'Credit Card' },
  { id: 'paypal', label: 'PayPal' },
];

export const RESERVATION_STATUSES = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
};

export const INVENTORY_CATEGORIES = [
  'Appetizers',
  'Main Courses',
  'Desserts',
  'Beverages',
];

export const NOTIFICATION_TYPES = {
  EMAIL: 'Email',
  SMS: 'SMS',
  PUSH: 'Push Notification',
};

export const REPORT_TYPES = {
  SALES: 'Sales Report',
  INVENTORY: 'Inventory Report',
  RESERVATIONS: 'Reservations Report',
};

export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_1234567890abcdef';

export const AWS_S3_BUCKET = import.meta.env.VITE_AWS_S3_BUCKET || 'restaurant-app-bucket';

export const AUTH_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer',
};

export const DATE_FORMATS = {
  DISPLAY: 'MMMM Do, YYYY',
  API: 'YYYY-MM-DD',
};

export const TIME_FORMATS = {
  DISPLAY: 'h:mm A',
  API: 'HH:mm:ss',
};

export const PAGINATION_LIMIT = 10;

export const LOADING_MESSAGES = {
  DEFAULT: 'Loading, please wait...',
  INVENTORY: 'Loading inventory...',
  RESERVATIONS: 'Loading reservations...',
  PAYMENTS: 'Processing payment...',
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required.',
  EMAIL: 'Please enter a valid email address.',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long.',
  PASSWORD_MATCH: 'Passwords must match.',
};

export const APP_NAME = 'Restaurant Manager';

export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr'];

export const THEME_COLORS = {
  PRIMARY: 'bg-blue-600',
  SECONDARY: 'bg-green-500',
  ERROR: 'bg-red-500',
  SUCCESS: 'bg-green-500',
  WARNING: 'bg-yellow-500',
};

export const ANIMATION_CLASSES = {
  LOADING: 'animate-pulse',
  BOUNCE: 'animate-bounce',
  FADE_IN: 'transition-opacity duration-300',
};

export const ICONS = {
  HOME: 'home',
  USER: 'user',
  SETTINGS: 'settings',
  LOGOUT: 'logout',
};

export default {
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAYMENT_OPTIONS,
  RESERVATION_STATUSES,
  INVENTORY_CATEGORIES,
  NOTIFICATION_TYPES,
  REPORT_TYPES,
  STRIPE_PUBLIC_KEY,
  AWS_S3_BUCKET,
  AUTH_ROLES,
  DATE_FORMATS,
  TIME_FORMATS,
  PAGINATION_LIMIT,
  LOADING_MESSAGES,
  VALIDATION_MESSAGES,
  APP_NAME,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  THEME_COLORS,
  ANIMATION_CLASSES,
  ICONS,
};