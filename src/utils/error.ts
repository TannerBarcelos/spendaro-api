import { StatusCodes } from "http-status-codes";

type Details = Array<any>;

/**
 * Custom error class for Spendaro
 *
 * @class SpendaroError
 * @extends {Error}
 * @param {string} message - Error message
 * @param {StatusCodes} statusCode - HTTP status code
 * @param {Details} details - Context of the error - Can contain additional information in the form of key-value pairs i.e `{ "reason": "Budget not found" }`
 * @returns {void}
 */
export class SpendaroError extends Error {
  constructor(public message: string, public statusCode: StatusCodes, public details: Details = []) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends SpendaroError {
  constructor(message: string, details?: Details) {
    super(message, StatusCodes.NOT_FOUND, details);
  }
}

export class BadRequestError extends SpendaroError {
  constructor(message: string, details?: Details) {
    super(message, StatusCodes.BAD_REQUEST, details);
  }
}

export class UnauthorizedError extends SpendaroError {
  constructor(message: string, details?: Details) {
    super(message, StatusCodes.UNAUTHORIZED, details);
  }
}

export class ForbiddenError extends SpendaroError {
  constructor(message: string, details?: Details) {
    super(message, StatusCodes.FORBIDDEN, details);
  }
}

export class InternalServerError extends SpendaroError {
  constructor(message: string, details?: Details) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, details);
  }
}
