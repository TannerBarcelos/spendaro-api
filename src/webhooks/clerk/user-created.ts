import type { FastifyReply, FastifyRequest } from "fastify";

export async function userCreated(request: FastifyRequest, reply: FastifyReply) {
  console.log(request.body);
  reply.send("ok");
}
