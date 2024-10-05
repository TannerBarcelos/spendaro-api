/**
 * Custom error class for handling errors in the application. This class extends the native Error class and adds a statusCode property to it so that we can use it to send the appropriate HTTP status code in the response in the Fastify error handler.
 */
export class SpendaroError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
