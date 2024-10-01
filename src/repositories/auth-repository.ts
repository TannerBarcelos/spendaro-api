import { SpendaroSchema, TUser, TUserResult, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

type TCommonUserResponse = Promise<TUserResult>;
export interface IAuthRepository {
  signup(user: TUser): TCommonUserResponse;
  signin(user: Pick<TUser, 'email' | 'password'>): TCommonUserResponse;
}

class AuthRepository implements IAuthRepository {
  private db: PostgresJsDatabase<SpendaroSchema>;

  constructor(db: PostgresJsDatabase<SpendaroSchema>) {
    this.db = db;
  }

  async signin(candidateUser: TUser): TCommonUserResponse {
    const [foundUser]: Array<TUserResult> = await this.db
      .select()
      .from(users)
      .where(eq(users.email, candidateUser.email));
    return foundUser;
  }

  async signup(user: TUser): TCommonUserResponse {
    const [newUser]: Array<TUserResult> = await this.db
      .insert(users)
      .values(user)
      .returning();
    return newUser;
  }
}

export { AuthRepository };
