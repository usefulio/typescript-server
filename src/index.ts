import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { Container } from "typedi";
import * as TypeGraphQL from "type-graphql";
import * as TypeORM from "typeorm";

import { seedDatabase } from "./helpers/seedDatabase";

import { authChecker } from "./utils/authChecker";
import { createContext } from "./utils/createContext";

TypeGraphQL.useContainer(Container);
TypeORM.useContainer(Container);

const bootstrap = async function() {
  try {
    await TypeORM.createConnection();

    const schema = await TypeGraphQL.buildSchema({
      resolvers: [
        // Glob pattern used in development.
        __dirname + "/resolvers/*.ts",
        // Glob pattern used in production.
        __dirname + "/resolvers/*.js",
      ],
      authChecker,
      // authMode: "null",
      emitSchemaFile: true,
    });

    await seedDatabase();

    const apolloServer = new ApolloServer({ schema, context: createContext });
    await apolloServer.listen({ port: process.env.PORT });

    const url = `http://localhost:${process.env.PORT}${
      apolloServer.graphqlPath
    }`;
    console.log(`Server running at ${url}`);
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
