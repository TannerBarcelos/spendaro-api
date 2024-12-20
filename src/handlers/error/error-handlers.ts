import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from "fastify-type-provider-zod";
import { getReasonPhrase } from "http-status-codes";
import pg from "postgres";

import { SpendaroError } from "@/utils/error";
import { STATUS_CODES } from "@/utils/http";

export class ErrorHandlers {
  static async handleNotFoundError(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    reply
      .status(STATUS_CODES.NOT_FOUND)
      .send(
        {
          error: getReasonPhrase(STATUS_CODES.NOT_FOUND),
          message: "Resource not found",
          details: {
            issues: [],
            method: request.method,
            url: request.url,
          },
        },
      );
  }

  static async handleError(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    request.log.error(error); // send to Sentry or similar service to monitor errors

    const includeStack = process.env.NODE_ENV === "development" ? error.stack : undefined;

    // Handle schema validation errors
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply
        .code(400)
        .send({
          error: "Response Validation Error",
          message: "Input doesn't match the schema for this request",
          details: {
            issues: error.validation,
            method: request.method,
            url: request.url,
            stack: includeStack,
          },
        });
    }

    // Handle response serialization errors
    if (isResponseSerializationError(error)) {
      return reply.code(500).send({
        error: "Internal Server Error",
        message: "Response doesn't match the schema",
        details: {
          issues: error.cause.issues,
          method: error.method,
          url: error.url,
          stack: includeStack,
        },
      });
    }

    // Handle Postgres errors (db calls will fail for things like duplicate keys, etc.)
    if (error instanceof pg.PostgresError) {
      switch (error.code) {
        case "23505": {
          return reply.code(STATUS_CODES.CONFLICT).send({
            error: getReasonPhrase(STATUS_CODES.CONFLICT),
            message: "This record already exists. Please try again.",
            details: {
              issues: [error.detail, error.message],
              method: request.method,

              url: request.url,
              stack: includeStack,
            },
          });
        }
        case "23503": {
          return reply.code(STATUS_CODES.BAD_REQUEST).send({
            error: getReasonPhrase(STATUS_CODES.BAD_REQUEST),
            message: error.detail ?? "Foreign key constraint violation",
            details: {
              issues: [error.message],
              method: request.method,
              url: request.url,
              stack: includeStack,
            },
          });
        }
        case "23514": {
          return reply.code(STATUS_CODES.BAD_REQUEST).send({
            error: getReasonPhrase(STATUS_CODES.BAD_REQUEST),
            message: error.detail ?? "Check constraint violation",
            details: {
              issues: [error.message],
              method: request.method,
              url: request.url,
              stack: includeStack,
            },
          });
        }
        case "42703": {
          return reply.code(STATUS_CODES.BAD_REQUEST).send({
            error: getReasonPhrase(STATUS_CODES.BAD_REQUEST),
            message: error.detail ?? "Undefined column in the request",
            details: {
              issues: [error.message],
              method: request.method,
              url: request.url,
              stack: includeStack,
            },
          });
        }
        default:
          return reply.code(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
            error: getReasonPhrase(STATUS_CODES.INTERNAL_SERVER_ERROR),
            message: "An unexpected error occurred",
            details: {
              issues: [error.message],
              method: request.method,
              url: request.url,
              stack: includeStack,
            },
          });
      }
    }

    // Handle custom errors thrown by the application
    if (error instanceof SpendaroError) {
      return reply.code(error.statusCode).send({
        error: getReasonPhrase(error.statusCode),
        message: error.message,
        details: {
          issues: error.details,
          method: request.method,
          url: request.url,
          stack: includeStack,
        },
      });
    }

    // Handle unexpected errors as the fallback case
    reply.code(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      error: getReasonPhrase(STATUS_CODES.INTERNAL_SERVER_ERROR),
      message: "An unexpected error occurred",
      details: {
        issues: [error.message],
        method: request.method,
        url: request.url,
        stack: includeStack,
      },
    });
  }
}
