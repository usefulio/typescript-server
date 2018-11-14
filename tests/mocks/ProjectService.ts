import { Project } from "../../src/types/Project";
import { ProjectService as ProjectServiceParent } from "../../src/services/ProjectService";

export class ProjectService extends ProjectServiceParent {
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
