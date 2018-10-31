import { UserResolver } from "../../src/resolvers/UserResolver";

import { Project } from "../../src/types/Project";
import { User } from "../../src/types/User";
import { Context } from "../../src/utils/Context";

import { createProject } from "../utils/createProject";
import { createUser } from "../utils/createUser";
import { ProjectServiceMock } from "../utils/ProjectServiceMock";
import { UserServiceMock } from "../utils/UserServiceMock";

describe("UserResolver", () => {
  it(`should resolve the "user" query with the user object`, async () => {
    const users = [createUser({ id: 1 })];
    const projects = [createProject({ id: 1, user: users[0] })];
    const userResolver = new UserResolver(
      new ProjectServiceMock(projects),
      new UserServiceMock(users),
    );
    const ctx: Context = { user: { id: 1, roles: [] } };

    const resolvedUser: User = await userResolver.user(users[0].id, ctx);
    expect(resolvedUser).toBeInstanceOf(User);
    expect(resolvedUser.id).toBe(users[0].id);
  });

  it(`should resolve the "user" query with undefined value`, async () => {
    const users = [];
    const projects = [];
    const userResolver = new UserResolver(
      new ProjectServiceMock(projects),
      new UserServiceMock(users),
    );
    const ctx: Context = { user: { id: 1, roles: [] } };

    const resolvedUser: User = await userResolver.user(1, ctx);
    expect(resolvedUser).toBeUndefined();
  });

  it(`should resolve the "users" query with users list`, async () => {
    const users = [createUser({ id: 1 })];
    const projects = [createProject({ id: 1, user: users[0] })];
    const userResolver = new UserResolver(
      new ProjectServiceMock(projects),
      new UserServiceMock(users),
    );

    const resolvedUsers: User[] = await userResolver.users();
    expect(resolvedUsers).toBeInstanceOf(Array);
    expect(resolvedUsers.length).toBeGreaterThan(0);
    expect(resolvedUsers[0]).toBeInstanceOf(User);
  });

  it(`should resolve the "users" query with empty users list`, async () => {
    const users = [];
    const projects = [];
    const userResolver = new UserResolver(
      new ProjectServiceMock(projects),
      new UserServiceMock(users),
    );

    const resolvedUsers: User[] = await userResolver.users();
    expect(resolvedUsers).toBeInstanceOf(Array);
    expect(resolvedUsers.length).toBe(0);
  });

  it(`should resolve the "projects" field with user's projects list`, async () => {
    const users = [createUser({ id: 1 })];
    const projects = [createProject({ id: 1, user: users[0] })];
    const userResolver = new UserResolver(
      new ProjectServiceMock(projects),
      new UserServiceMock(users),
    );

    const resolvedProjects: Project[] = await userResolver.projects(users[0]);
    expect(resolvedProjects).toBeInstanceOf(Array);
    expect(resolvedProjects.length).toBeGreaterThan(0);
    expect(resolvedProjects[0]).toBeInstanceOf(Project);
  });

  it(`should resolve the "projects" field with user's empty projects list`, async () => {
    const users = [createUser({ id: 1 })];
    const projects = [];
    const userResolver = new UserResolver(
      new ProjectServiceMock(projects),
      new UserServiceMock(users),
    );

    const resolvedProjects: Project[] = await userResolver.projects(users[0]);
    expect(resolvedProjects).toBeInstanceOf(Array);
    expect(resolvedProjects.length).toBe(0);
  });
});
