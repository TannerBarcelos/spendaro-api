import { insertUserSchema, selectUserSchema, TUser } from '@/db/schema';
import { AuthService } from '@/services/auth-service';
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { prepareResponse, STATUS_CODES } from '@/utils/http';
import config from 'config';

const sharedJwtSigningConfig = {
  expiresIn: config.get<string>('security.jwt.expires_in') ?? '15m',
};

class AuthHandlers {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async signupUserHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = insertUserSchema.parse(request.body);
      const signedUpUser = await this.authService.signup(user);
      const token = request.server.jwt.sign(
        {
          user_id: signedUpUser.id,
          email: signedUpUser.email,
          first_name: signedUpUser.firstName,
          last_name: signedUpUser.lastName,
        },
        sharedJwtSigningConfig
      );
      reply.send(
        prepareResponse(
          token,
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

  async signinUserHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.body as Pick<TUser, 'email' | 'password'>;
      const signedInUser = await this.authService.signin(user);
      const token = request.server.jwt.sign(
        {
          user_id: signedInUser.id,
          email: signedInUser.email,
          first_name: signedInUser.firstName,
          last_name: signedInUser.lastName,
        },
        {
          expiresIn: config.get('security.jwt.expires_in') ?? '15m',
        }
      );
      reply.send(
        prepareResponse(
          { token },
          STATUS_CODES.OK,
          'User signed in successfully'
        )
      );
    } catch (error) {
      reply
        .status(STATUS_CODES.BAD_REQUEST)
        .send(prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request'));
    }
  }

  registerHandlers(server: FastifyInstance) {
    server.post('/signup', this.signupUserHandler.bind(this)); // bind the context of the class to the handler so that 'this' refers to the class instance that gets created (this is not a Fastify thing, it's a JavaScript thing required because I am referencing 'this' inside the class methods)
    server.post('/signin', this.signinUserHandler.bind(this));
  }
}

export { AuthHandlers };
