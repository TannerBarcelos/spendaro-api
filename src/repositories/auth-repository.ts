import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { eq } from "drizzle-orm";

import type { TCandidateUser, TFoundUserResult, TUserToCreate } from "@/db/types";

import * as schema from "@/db/schema";

export interface IAuthRepository {
  signup: (user: TUserToCreate) => Promise<TFoundUserResult>;
  signin: (user: TCandidateUser) => Promise<TFoundUserResult>;
}

export class AuthRepository implements IAuthRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  async signin(TCandidateUser: TCandidateUser): Promise<TFoundUserResult> {
    const [foundUser]: Array<TFoundUserResult> = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, TCandidateUser.email));
    return foundUser;
  }

  async signup(user: TUserToCreate): Promise<TFoundUserResult> {
    const [newUser]: Array<TFoundUserResult> = await this.db
      .insert(schema.users)
      .values(user)
      .returning();
    return newUser;
  }
}
