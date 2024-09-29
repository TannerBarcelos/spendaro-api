import { insertUserSchema, selectUserSchema } from '@/db/schema';
import { AuthService } from '@/services/auth-service';
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { prepareResponse, STATUS_CODES } from '@/util/http';

export class AuthHandlers {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async signupUserHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = insertUserSchema.parse(request.body);
      const signedUpUser = await this.authService.signup(user);
      reply.send(
        prepareResponse(
          signedUpUser,
          STATUS_CODES.CREATED,
          'User created successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
      );
    }
  }

  signinUserHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = selectUserSchema.parse(request.body);
      const signedInUser = this.authService.signin(user);
      reply.send(
        prepareResponse(
          signedInUser,
          STATUS_CODES.OK,
          'User signed in successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
      );
    }
  }

  registerHandlers(server: FastifyInstance) {
    server.post('/signup', this.signupUserHandler.bind(this)); // bind the context of the class to the handler so that 'this' refers to the class instance that gets created (this is not a Fastify thing, it's a JavaScript thing required because I am referencing 'this' inside the class methods)
    server.post('/signin', this.signinUserHandler.bind(this));
  }
}
