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

import { User } from "../types/User";

import { Context } from "../utils/Context";

@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  @Authorized()
  @Query(returns => User, {
    nullable: true,
    description: "Return user details by ID",
  })
  user(@Arg("id", type => Int) id: number, @Ctx() ctx: Context) {
    // You can only retrieve profile data of yourself.
    if (id !== ctx.user.id) {
      throw new UnauthorizedError();
    }
    return this.userService.findOneById(id);
  }

  @Authorized("admin")
  @Query(returns => [User], {
    nullable: true,
    description: "Return list of users",
  })
  users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @FieldResolver({ description: "Return list of projects for a given user" })
  projects(@Root() user: User) {
    return this.projectService.findByUserId(user.id);
  }
}
