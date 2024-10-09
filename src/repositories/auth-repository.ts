import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { eq } from "drizzle-orm";

import type { TUser, TUserResult } from "../db/types.js";

import * as schema from "../db/schema.js";

type TCommonUserResponse = Promise<TUserResult>;
export interface IAuthRepository {
  signup: (user: TUser) => TCommonUserResponse;
  signin: (user: Pick<TUser, "email" | "password">) => TCommonUserResponse;
}

class AuthRepository implements IAuthRepository {
  private db: PostgresJsDatabase<typeof schema>;

  constructor(db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  async signin(candidateUser: Pick<TUser, "email" | "password">): TCommonUserResponse {
    const [foundUser]: Array<TUserResult> = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, candidateUser.email));
    return foundUser;
  }

  async signup(user: TUser): TCommonUserResponse {
    const [newUser]: Array<TUserResult> = await this.db
      .insert(schema.users)
      .values(user)
      .returning();
    return newUser;
  }
}

export { AuthRepository };
