import { plainToClass } from "class-transformer";

import { Project } from "../../src/types/Project";
import { User } from "../../src/types/User";

let nextId = 1;

interface ProjectInterface {
  id?: number;
  user?: User;
}

export const createProject = (project?: ProjectInterface): Project => {
  return plainToClass(Project, {
    id: (project && project.id) || nextId++,
    name: "Sample Project",
    createdAt: new Date(),
    user: project && project.user,
    userId: project && project.user && project.user.id,
  });
};
