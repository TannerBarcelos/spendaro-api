import type * as user_schemas from "@/handlers/user/user-schemas";

interface CommonMethods {
  findUserById: (user_id: string) => Promise<user_schemas.TFoundUserResult | undefined>;
}

export interface IAuthRepository extends CommonMethods {
  createUser: (user_to_create: user_schemas.TUserToCreate) => Promise<user_schemas.TFoundUserResult>;
  findUserByEmail: (user_email: string) => Promise<user_schemas.TFoundUserResult | undefined>;
}

export interface IUserRepository extends CommonMethods {
  updateUser: (user_id: string, user_to_update: user_schemas.TUserToUpdate) => Promise<user_schemas.TFoundUserResult>;
  deleteUser: (user_id: string) => Promise<user_schemas.TFoundUserResult>;
}
