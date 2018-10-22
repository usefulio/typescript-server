import { getRepository } from "typeorm";
import * as DataLoader from "dataloader";

import { Project } from "../types/Project";

export class ProjectLoader extends DataLoader<number, Project> {
  private readonly projectRepository = getRepository(Project);

  constructor() {
    super(async ids => {
      console.log("PROJECT", ids);
      const projects = await this.projectRepository.findByIds(ids);
      return ids.map(id => projects.find(project => project.id === id));
    });
  }
}
