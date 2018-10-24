import { plainToClass } from "class-transformer";

import { Project } from "../../src/types/Project";
import { ProjectService } from "../../src/services/ProjectService";

export class ProjectServiceMock extends ProjectService {
  constructor(private readonly projects: Project[]) {
    super();
  }

  async findOneById(projectId: number): Promise<Project> {
    return this.projects.find(project => project.id === projectId);
  }

  async findAll(): Promise<Project[]> {
    return this.projects.slice();
  }

  async findByUserId(userId: number): Promise<Project[]> {
    return this.projects.filter(project => project.userId === userId);
  }
}
