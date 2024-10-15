import { StatusCodes } from "http-status-codes";

type Tctx = Array<any>;

/**
 * Custom error class for Spendaro
 *
 * @class SpendaroError
 * @extends {Error}
 * @param {string} message - Error message
 * @param {StatusCodes} statusCode - HTTP status code
 * @param {Tctx} ctx - Context of the error - Can contain additional information in the form of key-value pairs i.e `{ "reason": "Budget not found" }`
 * @returns {void}
 */
export class SpendaroError extends Error {
  constructor(public message: string, public statusCode: StatusCodes, public ctx: Tctx = []) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.ctx = ctx;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends SpendaroError {
  constructor(message: string, ctx?: Tctx) {
    super(message, StatusCodes.NOT_FOUND, ctx);
  }
}

export class BadRequestError extends SpendaroError {
  constructor(message: string, ctx?: Tctx) {
    super(message, StatusCodes.BAD_REQUEST, ctx);
  }
}

export class UnauthorizedError extends SpendaroError {
  constructor(message: string, ctx?: Tctx) {
    super(message, StatusCodes.UNAUTHORIZED, ctx);
  }
}

export class ForbiddenError extends SpendaroError {
  constructor(message: string, ctx?: Tctx) {
    super(message, StatusCodes.FORBIDDEN, ctx);
  }
}

export class InternalServerError extends SpendaroError {
  constructor(message: string, ctx?: Tctx) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, ctx);
  }
}
