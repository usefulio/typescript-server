import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { User } from "../types/User";

export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  findOneById(userId: number): Promise<User> {
    return this.userRepository.findOne(userId);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
