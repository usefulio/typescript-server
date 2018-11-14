import { plainToClass } from "class-transformer";

import { User } from "../../src/types/User";

let nextId = 1;

interface UserInterface {
  id?: number;
}

export const createUser = (user?: UserInterface) => {
  return plainToClass(User, {
    id: (user && user.id) || nextId++,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@gmail.com",
    address: "9427 Delaware Circle, Venice, FL 34293",
    createdAt: new Date(),
  });
};
