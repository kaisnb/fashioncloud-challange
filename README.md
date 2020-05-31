## Intro

Since i never used ExpressJS directly i used a framework i am more familiar with called NestJS. Its built on top of ExpressJS but is also compatible with other libraries such as Fastify. It gives us typescript support out of the box. Since i also never worked with MongoDB i decided to use the object modeling tool mongosse which is also supported by NestJs.

P.S.: Sorry i forgot to keep the commit history clean an granular :)

## Installation

```bash
$ npm install
```

## Running the app

The up can run on any machine without setting up mongoDB because a public availabe mongoDB instance is used. Thanks to https://www.mongodb.com/cloud/atlas Free tier.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

Currently there exists only unit tests. In the future e2e and integration tests should be added.

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Documentation

To generate an API-Documenation compodoc is used.

```bash
# generate documentation
$ npm run compodoc

# check documentation coverage
$ npm run compodoc:cov
```

## TODOs

- Check if the expiry or a LRU cache can be implemented with database features
- Remove the \_id field or use it for the key
- In case of an expired cache hit or cache miss, the response contains \$setOnInsert property
- Does the Cache#get method need to be atomic to prevent overriding cache entries?
- Add typings return value remove & removeAll
- Create service for logging
