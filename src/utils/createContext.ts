import { getRepository } from "typeorm";

import { Context } from "./Context";
import { authenticate } from "./authenticate";

import { User } from "../types/User";

export const createContext = async ({ req, res }) => {
  let context: Context = {};
  const userId = authenticate({ req });
  if (userId) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(userId);
    context.user = { id: userId, roles: user.roles };
  }
  return context;
};
