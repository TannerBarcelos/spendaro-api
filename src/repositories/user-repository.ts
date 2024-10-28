import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { eq } from "drizzle-orm";

import type { TFoundUserResult, TUserToUpdate } from "@/handlers/auth/auth-schemas";

import * as schema from "@/db/schema";

import type { IUserRepository } from ".";

export class UserRepository implements IUserRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  async updateUser(user_id: number, userToUpdate: TUserToUpdate): Promise<TFoundUserResult> {
    const [updatedUser]: Array<TFoundUserResult> = await this.db
      .update(schema.users)
      .set(userToUpdate)
      .where(eq(schema.users.id, user_id))
      .returning();
    return updatedUser;
  }

  async deleteUser(user_id: number): Promise<TFoundUserResult> {
    const [deletedUser]: Array<TFoundUserResult> = await this.db
      .delete(schema.users)
      .where(eq(schema.users.id, user_id))
      .returning();
    return deletedUser;
  }

  async findUserById(id: number): Promise<TFoundUserResult | undefined> {
    const [foundUser] = await this.db.select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return foundUser;
  }
}
