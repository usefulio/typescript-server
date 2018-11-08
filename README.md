# TypeScript GraphQL Server

This Startup Kit is written in TypeScript and uses [Apollo Server](https://www.apollographql.com/docs/apollo-server/) + [TypeGraphQL](https://19majkel94.github.io/type-graphql/) + [TypeORM](http://typeorm.io/).

In Apollo GraphQL to define schema we use GraphQL Schema Language which is a nice form of defining schema separate from resolvers. In pure GraphQL JS, we define all the schema in the code. This stack uses TypeGraphQL which allows you to define schema in the code but at the same time is much more readable because it's using all the benefits of TypeScript like classes, types, interfaces, decorators etc.

## Directories structure

All the source files are located in the `src` folder which is divided into following directories:

- `helpers` - some helper functions (for now only used to populate PostgresSQL database with data)
- `resolvers` - definition of all the resolvers
- `services` - contains classes using the service/repository pattern, where each file contains helper functions to retrieve data from the database
- `types` - definition of all the types for GraphQL but also for TypeORM entities. Both GraphQL type and TypeORM entity are defined in the same class
- `utils` - some utility functions which you will probably not modify a lot. It just contains authentication methods and context types

The test files are located in the `tests` directory.

## How to run locally

To run project locally in development mode, first you have to create `.env` file in the root directory of the project. You shouldn't commit this file. File content should look like:

```sh
TYPEORM_CONNECTION=postgres
TYPEORM_HOST=localhost
TYPEORM_DATABASE=database
TYPEORM_USERNAME=username
TYPEORM_PASSWORD=password
TYPEORM_PORT=5432
TYPEORM_SYNCHRONIZE=true # Recreate database on each launch
TYPEORM_LOGGER=advanced-console # Logs with syntax highlighting
TYPEORM_LOGGING=all
TYPEORM_ENTITIES=src/types/*.ts
TYPEORM_DROP_SCHEMA=true # Drops schema on every reconnection
PORT=4000
AUTHORIZATION_SECRET=secret
```

Next you can run project by executing command:

```sh
npm run dev
```

## How to run on production

In your CI tool you have to define environment variables. Here is a list of variables:

```sh
TYPEORM_CONNECTION=postgres
TYPEORM_HOST=host
TYPEORM_DATABASE=database
TYPEORM_USERNAME=username
TYPEORM_PASSWORD=password
TYPEORM_PORT=5432
TYPEORM_LOGGER=simple-console
TYPEORM_LOGGING=all
TYPEORM_ENTITIES=build/types/*.js
PORT=80
AUTHORIZATION_SECRET=secret
```

Next you have to build project by running command:

```sh
npm run build
```

Next you start application by executing command:

```sh
npm run start
```

## How to test

To test project, you have to run command:

```sh
npm run test
```

## Update schema

### Add type/entity

1. Create a new file in the `types` directory with the name `[TypeName].ts`.
2. In the file create and export class with the same name as the file.
3. Add two class decorators:

- `@ObjectType()` to make it GraphQL type.
- `@Entity()` to make it TypeORM entity so it will store instances of the class in the database.

4. In the class define list of fields.

- To each field that you want to store in the database add the `@Column()` decorator.
- If you want given field to be GraphQL field add the `@Field()` decorator.
- Some fields can be defined as methods (resolvers) but should only be used if you compute value of a field using othe fields, like for example `fullName` being composed of the `firstName` and `lastName` that you already have access to. You should perform any database operations here.

### Add resolver

Having type/entity defined, now it's time to add some top level queries/resolvers and field resolvers. When using TypeGraphQL we're defining both top level queries and field resolvers in one file related with a given type. For example if we have `User` type and we want to have the top level `users` query that lists all the users we should put this query resolver in the `UserResolver` class. Also, if you want to add `posts` field resolver to the `User` type which lists all the posts of a given user, you also add that resolver in the `UserResolver` class.

1. Add the `[TypeName]Resolver.ts` file in the `resolvers` directory.
2. In the file, add the resolver class and decorate it with the `@Resolver(of => TypeName)` decorator passing function as the first argument which should return type (`TypeName`) that our resolver is related with.
3. Now let's add actual resolvers:

- To add top level query resolver, we add method to the class and decorate it with the `@Query()` decorator.
- To add field resolver to the given type, we add method to the class and decorate it with the `@FieldResolver()` class.

### Add service

For most types you would also add service that makes it easier to perform database operation. For example, instead of making complex query just right in the resolver we would externalize it to the service class that would make complex query and expose it under some method name.

Such a service can be later automatically injected into repository class when defined as the property of the repository class.

Service performs some database operations so it should inject TypeORM repository which is done using the `@InjectRepository(TypeName)` decorator in the service class.

### Authorization

TypeGraphQL comes with authorization built in.

- To restrict access to the given resolver/query for the signed in users just decorate it with the `@Authorized()` decorator.
- If you want to restrict access only to users with the `admin` role you would decorate it with the `@Authorized("admin")` decorator.
- If you want introduce more complex authorization rules like for example you should be able to only access your data and not data of other users, then you have to put such a logic in the resolver. Resolver should throw instance of the `UnauthorizedError` error if you want restrict access.

### DataLoaders

TypeGraphQL will come with the DataLoader build it. However, it's not yet implemented. There will be 1.0 release soon. And soon after that author of the library will implement DataLoader support. I was already playing with DataLoaders manually, implementing all the logic in the service class, however I haven't put this code in this repository as it will have nice API, that I will describe as soon as it's released.

## Add tests

TypeGraphQL is designed in the way that it's easy to mock database. It heavily uses the Dependency Injection pattern. For now, we only test resolvers. To test type resolver you have to import it into test file and instantiate. Resolver class should take services it depends on as the arguments of the constructor, so when instantiating we have to provide mock services to the constructor. Next, you just have to invoke resolver with some arguments and test returned value.
