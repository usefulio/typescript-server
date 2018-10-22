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
    },
    {
      id: 2,
      firstName: "Monika",
      lastName: "Jagodzińska",
      email: "monika.sedzicka@gmail.com",
      createdAt: new Date(),
    },
  ]);
  await userRepository.save(users);

  const projects = projectRepository.create([
    {
      id: 1,
      name: "Mieszkanie",
      user: users[0],
      createdAt: new Date("2018-04-11"),
    },
  ]);
  await projectRepository.save(projects);
}
