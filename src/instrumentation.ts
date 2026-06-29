import type { Instrumentation } from 'next';

export async function register() {
  // Hook de registro de instrumentación de Next.js
}

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  _context
) => {
  const { logger } = await import('./utils/server-logger');
  logger.error(
    {
      err,
      path: request.path,
      method: request.method,
    },
    'Server Exception'
  );
};
