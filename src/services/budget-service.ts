import { users, type TUser, type TUserResult } from '@/db/schema';
import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import config from 'config';

export async function signup(
  server: FastifyInstance,
  user: TUser
): Promise<TUserResult> {
  const salt = await bcrypt.genSalt(
    Number(config.get('security.jwt.salt_rounds')) ?? 10
  );
  const hash = await bcrypt.hash(user.password, salt);
  const newUser = await server.db
    .insert(users)
    .values({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hash, // stored as password_hash in the database
    })
    .returning();
  return newUser[0];
}

// export async function signin(
//   server: FastifyInstance,
//   email: string,
//   password: string
// ): Promise<TUserResult> {
//   const user = await server.db.query.users.findFirst({
//     where: {
//     }
//   })
//   if (!user) {
//     throw new Error('User not found');
//   }
//   const isValid = await bcrypt.compare(password, user.password);
//   if (!isValid) {
//     throw new Error('Invalid password. Passwords do not match');
//   }
//   return user;
// }
