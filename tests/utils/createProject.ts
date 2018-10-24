import { plainToClass } from "class-transformer";

import { Project } from "../../src/types/Project";
import { User } from "../../src/types/User";

export const createProject = ({ user }: { user: User }): Project => {
  return plainToClass(Project, {
    id: 1,
    name: "Sample Project",
    createdAt: new Date(),
    user,
    userId: user.id,
  });
};
