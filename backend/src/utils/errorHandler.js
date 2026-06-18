export const toErrorResponse = (error) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  return { status, message };
};
