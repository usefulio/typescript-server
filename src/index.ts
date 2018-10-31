import "reflect-metadata";
import { ApolloServer, gql } from "apollo-server";
import { Container } from "typedi";
import * as TypeGraphQL from "type-graphql";
import * as TypeORM from "typeorm";

import { seedDatabase } from "./helpers/seedDatabase";

import { Project } from "./types/Project";
import { User } from "./types/User";
import { ProjectResolver } from "./resolvers/ProjectResolver";
import { UserResolver } from "./resolvers/UserResolver";

import { authChecker } from "./utils/authChecker";
import { createContext } from "./utils/createContext";

TypeGraphQL.useContainer(Container);
TypeORM.useContainer(Container);

const config = {
  port: 4000,
};

const bootstrap = async function() {
  try {
    await TypeORM.createConnection({
      type: "postgres",
      database: "lukejagodzinski",
      username: "lukejagodzinski",
      // password: "",
      port: 5432,
      host: "localhost",
      entities: [Project, User],
      synchronize: true,
      logger: "advanced-console",
      logging: "all",
      dropSchema: true,
      cache: true,
    });

    const schema = await TypeGraphQL.buildSchema({
      resolvers: [ProjectResolver, UserResolver],
      authChecker,
      // authMode: "null",
    });

    await seedDatabase();

    const apolloServer = new ApolloServer({ schema, context: createContext });
    await apolloServer.listen({ port: config.port });

    const url = `http://localhost:${config.port}${apolloServer.graphqlPath}`;
    console.log(`Server running at ${url}`);
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
