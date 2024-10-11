import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { eq } from "drizzle-orm";

import type { TInsertUser, TUserResult } from "@/db/types.js";

import * as schema from "@/db/schema.js";

type TCommonUserResponse = Promise<TUserResult>;
export interface IAuthRepository {
  signup: (user: TInsertUser) => TCommonUserResponse;
  signin: (user: Pick<TInsertUser, "email" | "password">) => TCommonUserResponse;
}

export class AuthRepository implements IAuthRepository {
  private db: PostgresJsDatabase<typeof schema>;

  constructor(db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  async signin(candidateUser: Pick<TInsertUser, "email" | "password">): TCommonUserResponse {
    const [foundUser]: Array<TUserResult> = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, candidateUser.email));
    return foundUser;
  }

  async signup(user: TInsertUser): TCommonUserResponse {
    const [newUser]: Array<TUserResult> = await this.db
      .insert(schema.users)
      .values(user)
      .returning();
    return newUser;
  }
}
