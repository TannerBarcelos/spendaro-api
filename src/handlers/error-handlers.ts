import { prepareResponse } from '@/utils/http';
import { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import { STATUS_CODES } from '@/utils/http';
import { getReasonPhrase } from 'http-status-codes';

export class ErrorHandlers {
  static async handleNotFoundError(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    reply
      .status(STATUS_CODES.NOT_FOUND)
      .send(
        prepareResponse(
          null,
          STATUS_CODES.NOT_FOUND,
          getReasonPhrase(STATUS_CODES.NOT_FOUND),
          `Resource ${request.url} not found`
        )
      );
  }

  static async handleError(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    request.log.error(error); // send to Sentry or similar service to monitor errors
    reply
      .status(error.statusCode || 500)
      .send(
        prepareResponse(
          null,
          error.statusCode || 500,
          getReasonPhrase(error.statusCode || 500),
          process.env.NODE_ENV === 'development' ? error.stack : error.message
        )
      );
  }
}
