/**
 * Environment Variables Configuration
 * Access environment variables with fallback values
 */

// Site Configuration
export const SITE_URL = import.meta.env.SITE || 'https://lewiskori.com';

/**
 * Check if we're in production
 */
export const isProduction = import.meta.env.PROD;

/**
 * Check if we're in development
 */
export const isDevelopment = import.meta.env.DEV;
