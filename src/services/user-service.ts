import type * as user_schemas from "@/handlers/user/user-schemas";
import type { IUserRepository } from "@/repositories";

import { NotFoundError } from "@/utils/error";

export class UserService {
  constructor(private userRepo: IUserRepository) {}

  async findUserById(id: number): Promise<user_schemas.TFoundUserResult> {
    const foundUser = await this.userRepo.findUserById(id);
    if (!foundUser) {
      throw new NotFoundError("The requested user does not exist", [`User with id ${id} does not exist`]);
    }
    return foundUser;
  }

  async updateUser(id: number, user_to_update: user_schemas.TUserToUpdate): Promise<user_schemas.TFoundUserResult> {
    const foundUser = await this.userRepo.findUserById(id);
    if (!foundUser) {
      throw new NotFoundError("The requested user does not exist", [`User with id ${id} does not exist`]);
    }
    const updatedUser = await this.userRepo.updateUser(id, user_to_update);
    return updatedUser;
  }

  async deleteUser(user_id: number): Promise<user_schemas.TFoundUserResult> {
    const foundUser = await this.userRepo.findUserById(user_id);
    if (!foundUser) {
      throw new NotFoundError("The requested user does not exist", [`User with id ${user_id} does not exist`]);
    }
    const deletedUser = await this.userRepo.deleteUser(user_id);
    return deletedUser;
  }
}
