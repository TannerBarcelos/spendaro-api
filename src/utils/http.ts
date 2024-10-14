import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE"];
export const STATUS_CODES = StatusCodes;

// Represents the common HTTP response schema for all responses when the request is successful (not > 400)
// All responses to a client can be expected to provide a `message` field and the data being returned
export const commonHttpResponseSchema = z.object({
  data: z.any().optional(),
  message: z.string(),
});

export function prepareResponse(response: any, message: string): z.infer<typeof commonHttpResponseSchema> {
  return {
    data: response, // no need to serialize the response, Fastify will do it for us! We just need to define the response with JSON schema
    message,
  };
}
