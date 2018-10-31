import { plainToClass } from "class-transformer";

import { User } from "../../src/types/User";

export const createUser = ({ id }: { id: number }) => {
  return plainToClass(User, {
    id,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@gmail.com",
    address: "9427 Delaware Circle, Venice, FL 34293",
    createdAt: new Date(),
  });
};
