import { plainToClass } from "class-transformer";

import { User } from "../../src/types/User";
import { UserService } from "../../src/services/UserService";

export class UserServiceMock extends UserService {
  constructor(private readonly users: User[]) {
    super();
  }

  async findOneById(userId: number): Promise<User> {
    return this.users.find(user => user.id === userId);
  }

  async findAll(): Promise<User[]> {
    return this.users.slice();
  }
}
