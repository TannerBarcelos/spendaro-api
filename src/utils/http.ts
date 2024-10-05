export const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  UPDATE: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const prepareResponse = (
  response: any,
  statusCode: number,
  message: string,
  error: Error | null
) => {
  return {
    status: statusCode,
    data: response, // no need to serialize the response, Fastify will do it for us! We just need to define the response with JSON schema
    message,
    error: error ? error.message : null,
  };
};