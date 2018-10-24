import { Repository } from "typeorm";
import { Inject } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Project } from "../types/Project";

export class ProjectService {
  @InjectRepository(Project)
  private readonly projectRepository: Repository<Project>;

  findOneById(projectId: number): Promise<Project> {
    return this.projectRepository.findOne(projectId);
  }

  findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  findByUserId(userId: number): Promise<Project[]> {
    return this.projectRepository.find({ where: { userId } });
  }
}
