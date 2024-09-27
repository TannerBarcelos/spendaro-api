import { FastifyInstance } from "fastify";
import { signupUserHandler, signinUserHandler } from "../handlers/auth-handlers";

export default async function(server: FastifyInstance) {
    server.post('/signup',  signupUserHandler)
    server.post('/signin',  signinUserHandler)
}