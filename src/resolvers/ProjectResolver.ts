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
  @Query(returns => Project, {
    nullable: true,
    description: "Return project details by its ID",
  })
  async project(@Arg("id", type => Int) id: number, @Ctx() ctx: Context) {
    const project = await this.projectService.findOneById(id);
    if (project && project.userId !== ctx.user.id) {
      throw new UnauthorizedError();
    }
    return project;
  }

  @Authorized()
  @Query(returns => [Project], {
    nullable: true,
    description: "Return list of projects for a signed in user",
  })
  projects(@Ctx() ctx: Context): Promise<Project[]> {
    return this.projectService.findByUserId(ctx.user.id);
  }

  @FieldResolver({
    description: "Return owner of the project",
  })
  user(@Root() project: Project) {
    return this.userService.findOneById(project.userId);
  }
}
