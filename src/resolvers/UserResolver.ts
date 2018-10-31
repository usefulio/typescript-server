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
import { User } from "../types/User";

import { Context } from "../utils/Context";

@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  @Authorized()
  @Query(returns => User, { nullable: true })
  user(@Arg("id", type => Int) id: number, @Ctx() ctx: Context) {
    console.log(ctx);
    // You can only retrieve profile data of yourself.
    if (id !== ctx.user.id) {
      throw new UnauthorizedError();
    }
    return this.userService.findOneById(id);
  }

  @Authorized("admin")
  @Query(returns => [User], { nullable: true })
  users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @FieldResolver()
  projects(@Root() user: User): Promise<Project[]> {
    return this.projectService.findByUserId(user.id);
  }
}
