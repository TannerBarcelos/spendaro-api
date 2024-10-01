import type { TUser, TUserResult } from '@/db/schema';
import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import config from 'config';
import { IAuthRepository } from '@/repositories/auth-repository';

class AuthService {
  authRepo: IAuthRepository;
  server: FastifyInstance;
  constructor(server: FastifyInstance, authRepo: IAuthRepository) {
    this.authRepo = authRepo;
    this.server = server;
  }
  async signup(user: TUser): Promise<TUserResult> {
    try {
      const salt = await bcrypt.genSalt(
        Number(config.get('security.jwt.salt_rounds')) ?? 10
      );
      const hash = await bcrypt.hash(user.password, salt);
      const newUser = await this.authRepo.signup({ ...user, password: hash }); // send the hashed password, not the plain text password
      return newUser;
    } catch (error) {
      throw new Error('User already exists. Please use a different email');
    }
  }
  async signin(
    candidateUser: Pick<TUser, 'email' | 'password'>
  ): Promise<TUserResult> {
    try {
      const signedInUser = await this.authRepo.signin(candidateUser);

      if (!signedInUser) {
        throw new Error('User does not exist');
      }

      const isValid = await bcrypt.compare(
        candidateUser.password,
        signedInUser.password
      );

      if (!isValid) {
        throw new Error('Invalid password. Passwords do not match');
      }

      return signedInUser;
    } catch (error) {
      throw new Error(
        'Failed to sign in user. Please check your email and password'
      );
    }
  }
}

export { AuthService };
