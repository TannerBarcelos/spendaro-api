import { FastifyReply, FastifyRequest } from "fastify";

function signupUserHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('signupUserHandler');
}

function signinUserHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('signinUserHandler');
}

export { signupUserHandler, signinUserHandler};