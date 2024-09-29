import { users, type TUser, type TUserResult } from '@/db/schema';
import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import config from 'config';
import { IAuthRepository } from '@/repositories/auth-repository';

export class AuthService {
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
      const newUser = await this.authRepo.signup({ ...user, password: hash });
      return newUser;
    } catch (error) {
      throw new Error('User already exists. Please use a different email');
    }
  }
  async signin(candidateUser: TUser): Promise<TUserResult> {
    try {
      const foundUser = await this.authRepo.signin(candidateUser);
      const isValid = await bcrypt.compare(
        candidateUser.password,
        foundUser.password
      );
      if (!isValid) {
        throw new Error('Invalid password. Passwords do not match');
      }
      return foundUser;
    } catch (error) {
      throw new Error(
        'Failed to sign in user. Please check your email and password'
      );
    }
  }
}
