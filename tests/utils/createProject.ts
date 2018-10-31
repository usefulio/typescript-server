import { plainToClass } from "class-transformer";

import { Project } from "../../src/types/Project";
import { User } from "../../src/types/User";

let nextId = 1;

export const createProject = ({
  id,
  user,
}: {
  id?: number;
  user: User;
}): Project => {
  return plainToClass(Project, {
    id: id || nextId++,
    name: "Sample Project",
    createdAt: new Date(),
    user,
    userId: user.id,
  });
};
