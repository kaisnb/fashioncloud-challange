## Description

Since i never used ExpressJs directly i used a framework i am more familiar with called nestjs. Its built on top of ExpressJs but is also compatible with other libraries such as Fastify. Since i also never worked with MongoDB i decided to use the object modeling tool mongosse which is also supported by NestJs.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## TODOs

- Move mongoDB connection string to .env file
- Documentation
- Remove the \_id field or use it for the key
- In case of an expired cache hit or chache miss, the response contains $setOnInsert property
- Does the Cache#get method need to be atomic to prevent overriding cache entries? 
- Add typings return value remove & removeAll
