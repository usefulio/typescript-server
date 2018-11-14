import { UserResolver } from "../../src/resolvers/UserResolver";

import { Project } from "../../src/types/Project";
import { User } from "../../src/types/User";
import { Context } from "../../src/utils/Context";

import { createProject } from "../utils/createProject";
import { createUser } from "../utils/createUser";
import { ProjectService } from "../mocks/ProjectService";
import { UserService } from "../mocks/UserService";

describe("UserResolver", () => {
  it(`should resolve the "user" query with the user object`, async () => {
    const users = [createUser()];
    const projects = [createProject({ user: users[0] })];
    const userResolver = new UserResolver(
      new ProjectService(projects),
      new UserService(users),
    );
    const ctx: Context = { user: { id: users[0].id, roles: [] } };

    const resolvedUser = await userResolver.user(users[0].id, ctx);
    expect(resolvedUser).toBeInstanceOf(User);
    expect(resolvedUser.id).toBe(users[0].id);
  });

  it(`should resolve the "user" query with undefined value`, async () => {
    const users = [];
    const projects = [];
    const userResolver = new UserResolver(
      new ProjectService(projects),
      new UserService(users),
    );
    const ctx: Context = { user: { id: 1, roles: [] } };

    const resolvedUser = await userResolver.user(1, ctx);
    expect(resolvedUser).toBeUndefined();
  });

  it(`should resolve the "users" query with users list`, async () => {
    const users = [createUser()];
    const projects = [createProject({ user: users[0] })];
    const userResolver = new UserResolver(
      new ProjectService(projects),
      new UserService(users),
    );

    const resolvedUsers = await userResolver.users();
    expect(resolvedUsers).toBeInstanceOf(Array);
    expect(resolvedUsers.length).toBe(1);
    expect(resolvedUsers[0]).toBeInstanceOf(User);
    expect(resolvedUsers[0].id).toBe(users[0].id);
  });

  it(`should resolve the "users" query with empty users list`, async () => {
    const users = [];
    const projects = [];
    const userResolver = new UserResolver(
      new ProjectService(projects),
      new UserService(users),
    );

    const resolvedUsers = await userResolver.users();
    expect(resolvedUsers).toBeInstanceOf(Array);
    expect(resolvedUsers.length).toBe(0);
  });

  it(`should resolve the "projects" field with user's projects list`, async () => {
    const users = [createUser(), createUser()];
    const projects = [
      createProject({ user: users[0] }),
      createProject({ user: users[0] }),
      createProject({ user: users[1] }),
    ];
    const userResolver = new UserResolver(
      new ProjectService(projects),
      new UserService(users),
    );

    const resolvedProjects = await userResolver.projects(users[0]);
    expect(resolvedProjects).toBeInstanceOf(Array);
    expect(resolvedProjects.length).toBe(2);
    expect(resolvedProjects[0]).toBeInstanceOf(Project);
    expect(resolvedProjects[0].userId).toBe(users[0].id);
    expect(resolvedProjects[1].userId).toBe(users[0].id);
  });

  it(`should resolve the "projects" field with user's empty projects list`, async () => {
    const users = [createUser()];
    const projects = [];
    const userResolver = new UserResolver(
      new ProjectService(projects),
      new UserService(users),
    );

    const resolvedProjects = await userResolver.projects(users[0]);
    expect(resolvedProjects).toBeInstanceOf(Array);
    expect(resolvedProjects.length).toBe(0);
  });
});
