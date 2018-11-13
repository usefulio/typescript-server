import { getRepository } from "typeorm";

import { Project } from "../types/Project";
import { User } from "../types/User";

export async function seedDatabase() {
  const projectRepository = getRepository(Project);
  const userRepository = getRepository(User);

  const users = userRepository.create([
    {
      id: 1,
      firstName: "Łukasz",
      lastName: "Jagodziński",
      email: "luke.jagodzinski@gmail.com",
      createdAt: new Date(),
      roles: ["admin"],
    },
    {
      id: 2,
      firstName: "Monika",
      lastName: "Jagodzińska",
      email: "monika.sedzicka@gmail.com",
      createdAt: new Date(),
      roles: [],
    },
  ]);
  await userRepository.save(users);

  const projects = projectRepository.create([
    {
      id: 1,
      name: "First Project",
      user: users[0],
      createdAt: new Date("2018-01-01"),
    },
    {
      id: 2,
      name: "Second Project",
      user: users[0],
      createdAt: new Date("2018-01-02"),
    },
    {
      id: 3,
      name: "My First Project",
      user: users[1],
      createdAt: new Date("2018-01-01"),
    },
  ]);
  await projectRepository.save(projects);
}
