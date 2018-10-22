import "reflect-metadata";
import { ApolloServer, gql } from "apollo-server";
import { Container } from "typedi";
import * as TypeGraphQL from "type-graphql";
import * as TypeORM from "typeorm";
import * as DataLoader from "dataloader";

import { Project } from "./types/Project";
import { User } from "./types/User";

import { seedDatabase } from "./helpers/seedDatabase";

import { ProjectResolver } from "./resolvers/ProjectResolver";
import { UserResolver } from "./resolvers/UserResolver";

import { ProjectLoader } from "./loaders/ProjectLoader";
import { UserLoader } from "./loaders/UserLoader";

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
    });

    await seedDatabase();

    Container.set("loaders", {
      project: new ProjectLoader(),
      user: new UserLoader(),
    });

    const apolloServer = new ApolloServer({
      schema,
      // playground: {
      //   endpoint: "playground"
      // },
      context: ({ req, res }) => ({}),
      formatResponse: (response: any) => {
        const loaders: {
          [key: string]: DataLoader<number, any>;
        } = Container.get("loaders");
        for (let loaderName of Object.keys(loaders)) {
          const loader = loaders[loaderName];
          loader.clearAll();
        }
        return response;
      },
    });

    await apolloServer.listen({ port: config.port });

    const url = `http://localhost:${config.port}${apolloServer.graphqlPath}`;
    console.log(`Server running at ${url}`);
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
