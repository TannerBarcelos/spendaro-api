import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { eq } from "drizzle-orm";

import type { TFoundUserResult, TUserToCreate } from "@/handlers/auth/auth-schemas";

import * as schema from "@/db/schema";

import type { AuthRepository as AuthRepo } from ".";

export class AuthRepository implements AuthRepo {
  constructor(private db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  async findUserByEmail(email: string): Promise<TFoundUserResult | undefined> {
    const [foundUser] = await this.db.select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
    return foundUser;
  }

  async createUser(user: TUserToCreate): Promise<TFoundUserResult> {
    const [newUser]: Array<TFoundUserResult> = await this.db
      .insert(schema.users)
      .values(user)
      .returning();
    return newUser;
  }
}
