import { StatusCodes } from "http-status-codes";

export const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
export const STATUS_CODES = StatusCodes;

export const prepareResponse = (
  response: any,
  statusCode: number,
  message: string,
  error: Error | unknown | null = null
) => {
  return {
    status: statusCode,
    data: response, // no need to serialize the response, Fastify will do it for us! We just need to define the response with JSON schema
    message,
    error: error ? error instanceof Error ? error.message : error : null,
  };
};
