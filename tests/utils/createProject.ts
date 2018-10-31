import { plainToClass } from "class-transformer";

import { Project } from "../../src/types/Project";
import { User } from "../../src/types/User";

export const createProject = ({
  id,
  user,
}: {
  id: number;
  user: User;
}): Project => {
  return plainToClass(Project, {
    id,
    name: "Sample Project",
    createdAt: new Date(),
    user,
    userId: user.id,
  });
};
