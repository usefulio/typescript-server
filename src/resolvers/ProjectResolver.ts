import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";

import { ProjectService } from "../services/ProjectService";
import { UserService } from "../services/UserService";

import { Project } from "../types/Project";

@Resolver(of => Project)
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  @Query(returns => Project, { nullable: true })
  project(@Arg("id", type => Int) id: number) {
    return this.projectService.findOneById(id);
  }

  @Query(returns => [Project])
  projects(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @FieldResolver()
  user(@Root() project: Project) {
    return this.userService.findOneById(project.userId);
  }
}
