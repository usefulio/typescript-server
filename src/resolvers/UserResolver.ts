import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";

import { ProjectService } from "../services/ProjectService";
import { UserService } from "../services/UserService";

import { Project } from "../types/Project";
import { User } from "../types/User";

@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  @Query(returns => User, { nullable: true })
  user(@Arg("id", type => Int) id: number) {
    return this.userService.findOneById(id);
  }

  @Query(returns => [User])
  users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @FieldResolver()
  projects(@Root() user: User): Promise<Project[]> {
    return this.projectService.findByUserId(user.id);
  }
}
