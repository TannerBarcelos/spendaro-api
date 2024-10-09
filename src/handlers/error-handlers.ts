import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { getReasonPhrase } from "http-status-codes";

import { env } from "../env.js";
import { prepareResponse, STATUS_CODES } from "../utils/http.js";

export class ErrorHandlers {
  static async handleNotFoundError(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    reply
      .status(STATUS_CODES.NOT_FOUND)
      .send(
        prepareResponse(
          null,
          STATUS_CODES.NOT_FOUND,
          getReasonPhrase(STATUS_CODES.NOT_FOUND),
          `Resource ${request.url} not found`,
        ),
      );
  }

  static async handleError(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    request.log.error(error); // send to Sentry or similar service to monitor errors
    reply
      .status(error.statusCode || 500)
      .send(
        prepareResponse(
          null,
          error.statusCode || 500,
          getReasonPhrase(error.statusCode || 500),
          env.NODE_ENV === "development" ? error.stack : error.message,
        ),
      );
  }
}
