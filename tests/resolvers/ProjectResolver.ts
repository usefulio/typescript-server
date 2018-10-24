import { ProjectResolver } from "../../src/resolvers/ProjectResolver";

import { Project } from "../../src/types/Project";
import { User } from "../../src/types/User";

import { createProject } from "../utils/createProject";
import { createUser } from "../utils/createUser";
import { ProjectServiceMock } from "../utils/ProjectServiceMock";
import { UserServiceMock } from "../utils/UserServiceMock";

describe("ProjectResolver", () => {
  it(`should resolve the "project" query with the project object`, async () => {
    const users = [createUser()];
    const projects = [createProject({ user: users[0] })];
    const projectResolver = new ProjectResolver(
      new ProjectServiceMock(projects),
      new UserServiceMock(users),
    );

    const resolvedProject: Project = await projectResolver.project(1);
    expect(resolvedProject).toBeInstanceOf(Project);
  });

  it(`should resolve the "project" query with undefined value`, async () => {
    const users = [];
    const projects = [];
    const projectResolver = new ProjectResolver(
      new ProjectServiceMock(projects),
      new UserServiceMock(users),
    );

    const resolvedProject: Project = await projectResolver.project(1);
    expect(resolvedProject).toBeUndefined();
  });

  it(`should resolve the "projects" query with projects list`, async () => {
    const users = [createUser()];
    const projects = [createProject({ user: users[0] })];
    const projectResolver = new ProjectResolver(
      new ProjectServiceMock(projects),
      new UserServiceMock(users),
    );

    const resolvedProjects: Project[] = await projectResolver.projects();
    expect(resolvedProjects).toBeInstanceOf(Array);
    expect(resolvedProjects.length).toBeGreaterThan(0);
    expect(resolvedProjects[0]).toBeInstanceOf(Project);
  });

  it(`should resolve the "projects" query with empty projects list`, async () => {
    const users = [];
    const projects = [];
    const projectResolver = new ProjectResolver(
      new ProjectServiceMock(projects),
      new UserServiceMock(users),
    );

    const resolvedProjects: Project[] = await projectResolver.projects();
    expect(resolvedProjects).toBeInstanceOf(Array);
    expect(resolvedProjects.length).toBe(0);
  });

  it(`should resolve the "user" field with project's creator`, async () => {
    const users = [createUser()];
    const projects = [createProject({ user: users[0] })];
    const projectResolver = new ProjectResolver(
      new ProjectServiceMock(projects),
      new UserServiceMock(users),
    );

    const resolvedUser: User = await projectResolver.user(projects[0]);
    expect(resolvedUser).toBeInstanceOf(User);
    expect(resolvedUser.id).toBe(projects[0].user.id);
  });
});
