import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Query,
  Resolver,
  Root,
  UnauthorizedError,
} from "type-graphql";

import { ProjectService } from "../services/ProjectService";
import { UserService } from "../services/UserService";

import { Project } from "../types/Project";

import { Context } from "../utils/Context";

@Resolver(of => Project)
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  @Authorized()
  @Query(returns => Project, { nullable: true })
  async project(@Arg("id", type => Int) id: number, @Ctx() ctx: Context) {
    const project = await this.projectService.findOneById(id);
    if (project && project.userId !== ctx.user.id) {
      throw new UnauthorizedError();
    }
    return project;
  }

  @Authorized("admin")
  @Query(returns => [Project], { nullable: true })
  projects(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @FieldResolver()
  user(@Root() project: Project) {
    return this.userService.findOneById(project.userId);
  }
}
