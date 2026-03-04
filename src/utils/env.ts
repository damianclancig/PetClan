/**
 * Utilidades para detectar el entorno de ejecución.
 * Útil para ocultar herramientas de depuración o simulación en producción.
 */

export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// Verificación adicional para localhost si fuera necesario
export const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
