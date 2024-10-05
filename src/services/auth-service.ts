import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import config from 'config';
import { IAuthRepository } from '@/repositories/auth-repository';
import { TUser, TUserResult } from '@/db/types';
import { SpendaroError } from '@/utils/error';

class AuthService {
  authRepo: IAuthRepository;
  server: FastifyInstance;
  constructor(server: FastifyInstance, authRepo: IAuthRepository) {
    this.authRepo = authRepo;
    this.server = server;
  }
  async signup(user: TUser): Promise<TUserResult> {
    const salt = await bcrypt.genSalt(
      Number(config.get('security.jwt.salt_rounds')) ?? 10
    );
    const hash = await bcrypt.hash(user.password, salt);
    const signedUpUser = await this.authRepo.signup({
      ...user,
      password: hash,
    }); // send the hashed password, not the plain text password

    // if (!signedUpUser) {
    //   throw new SpendaroError('User could not be created');
    // }

    return signedUpUser;
  }

  async signin(
    candidateUser: Pick<TUser, 'email' | 'password'>
  ): Promise<TUserResult> {
    const signedInUser = await this.authRepo.signin(candidateUser);

    if (!signedInUser) {
      throw new SpendaroError('User does not exist', 401);
    }

    const isValid = await bcrypt.compare(
      candidateUser.password,
      signedInUser.password
    );

    if (!isValid) {
      throw new SpendaroError(
        'Invalid credentials. Passwords do not match.',
        401
      );
    }

    return signedInUser;
  }
}

export { AuthService };
