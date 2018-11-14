import { User } from "../../src/types/User";
import { UserService as UserServiceParent } from "../../src/services/UserService";

export class UserService extends UserServiceParent {
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
