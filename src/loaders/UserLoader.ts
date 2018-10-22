import { getRepository } from "typeorm";
import * as DataLoader from "dataloader";

import { User } from "../types/User";

export class UserLoader extends DataLoader<number, User> {
  private readonly userRepository = getRepository(User);

  constructor() {
    super(async ids => {
      console.log("USER", ids);
      const users = await this.userRepository.findByIds(ids);
      return ids.map(id => users.find(user => user.id === id));
    });
  }
}
