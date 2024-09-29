export const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
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
  message: string
) => {
  return {
    statusCode,
    body: JSON.stringify(response),
    message,
  };
};
