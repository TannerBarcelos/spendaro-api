import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { eq } from "drizzle-orm";

import type * as user_schemas from "@/handlers/user/user-schemas";

import * as schema from "@/db/schema";

interface CommonMethods {
  findUserById: (user_id: string) => Promise<user_schemas.TFoundUserResult | undefined>;
}

export interface IUserRepository extends CommonMethods {
  updateUser: (user_id: string, user_to_update: user_schemas.TUserToUpdate) => Promise<user_schemas.TFoundUserResult>;
  deleteUser: (user_id: string) => Promise<user_schemas.TFoundUserResult>;
}

export class UserRepository implements IUserRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  async updateUser(user_id: string, userToUpdate: user_schemas.TUserToUpdate): Promise<user_schemas.TFoundUserResult> {
    const [updatedUser]: Array<user_schemas.TFoundUserResult> = await this.db
      .update(schema.users)
      .set(userToUpdate)
      .where(eq(schema.users.user_id, user_id))
      .returning();
    return updatedUser;
  }

  async deleteUser(user_id: string): Promise<user_schemas.TFoundUserResult> {
    const [deletedUser]: Array<user_schemas.TFoundUserResult> = await this.db
      .delete(schema.users)
      .where(eq(schema.users.user_id, user_id))
      .returning();
    return deletedUser;
  }

  async findUserById(user_id: string): Promise<user_schemas.TFoundUserResult | undefined> {
    const [foundUser] = await this.db.select()
      .from(schema.users)
      .where(eq(schema.users.user_id, user_id));
    return foundUser;
  }
}
