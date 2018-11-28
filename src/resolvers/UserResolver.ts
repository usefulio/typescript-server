import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UnauthorizedError,
} from "type-graphql";
import * as bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";

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

  @Mutation(returns => String, { nullable: true })
  async signIn(@Arg("email") email: string, @Arg("password") password: string) {
    // Find user with the given email address.
    const user = await this.userService.findOneByEmail(email);
    // Throw error if a user has not been found.
    if (!user) {
      throw new Error("Invalid email or password");
    }
    // Throw error if passwords are not equal.
    if (!(await bcryptjs.compare(password, user.password))) {
      throw new Error("Invalid email or password");
    }
    // Generate token with the "userId" payload and that expires after 30 days.
    const payload = { userId: user.id };
    // Get secret key from the environment variable.
    const secret = process.env.AUTHORIZATION_SECRET;
    // By default token expires after 30 days.
    const expiresIn = "30d";
    // Generate token.
    return jwt.sign(payload, secret, { expiresIn });
  }
}
