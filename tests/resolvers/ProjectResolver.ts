import { ProjectResolver } from "../../src/resolvers/ProjectResolver";

import { Project } from "../../src/types/Project";
import { User } from "../../src/types/User";
import { Context } from "../../src/utils/Context";

import { createProject } from "../utils/createProject";
import { createUser } from "../utils/createUser";
import { ProjectService } from "../mocks/ProjectService";
import { UserService } from "../mocks/UserService";

describe("ProjectResolver", () => {
  it(`should resolve the "project" query with the project object`, async () => {
    const users = [createUser(), createUser()];
    const projects = [
      createProject({ user: users[0] }),
      createProject({ user: users[0] }),
    ];
    const projectResolver = new ProjectResolver(
      new ProjectService(projects),
      new UserService(users),
    );
    const ctx: Context = { user: { id: users[0].id, roles: [] } };

    const resolvedProject = await projectResolver.project(projects[0].id, ctx);
    expect(resolvedProject).toBeInstanceOf(Project);
    expect(resolvedProject.id).toBe(projects[0].id);
  });

  it(`should resolve the "project" query with undefined value`, async () => {
    const users = [];
    const projects = [];
    const projectResolver = new ProjectResolver(
      new ProjectService(projects),
      new UserService(users),
    );
    const ctx: Context = { user: { id: 1, roles: [] } };

    const resolvedProject = await projectResolver.project(1, ctx);
    expect(resolvedProject).toBeUndefined();
  });

  it(`should resolve the "projects" query with projects list of signed in user`, async () => {
    const users = [createUser(), createUser()];
    const projects = [
      createProject({ user: users[0] }),
      createProject({ user: users[1] }),
    ];
    const projectResolver = new ProjectResolver(
      new ProjectService(projects),
      new UserService(users),
    );
    const ctx: Context = { user: { id: users[0].id, roles: [] } };

    const resolvedProjects = await projectResolver.projects(ctx);
    expect(resolvedProjects).toBeInstanceOf(Array);
    expect(resolvedProjects.length).toBe(1);
    expect(resolvedProjects[0]).toBeInstanceOf(Project);
    expect(resolvedProjects[0].userId).toBe(users[0].id);
  });

  it(`should resolve the "projects" query with empty projects list`, async () => {
    const users = [];
    const projects = [];
    const projectResolver = new ProjectResolver(
      new ProjectService(projects),
      new UserService(users),
    );
    const ctx: Context = { user: { id: 1, roles: [] } };

    const resolvedProjects = await projectResolver.projects(ctx);
    expect(resolvedProjects).toBeInstanceOf(Array);
    expect(resolvedProjects.length).toBe(0);
  });

  it(`should resolve the "user" field with project's creator`, async () => {
    const users = [createUser()];
    const projects = [createProject({ user: users[0] })];
    const projectResolver = new ProjectResolver(
      new ProjectService(projects),
      new UserService(users),
    );

    const resolvedUser = await projectResolver.user(projects[0]);
    expect(resolvedUser).toBeInstanceOf(User);
    expect(resolvedUser.id).toBe(projects[0].user.id);
  });
});
