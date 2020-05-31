## Intro

Since i never used ExpressJs directly i used a framework i am more familiar with called nestjs. Its built on top of ExpressJs but is also compatible with other libraries such as Fastify. It gives us typescript support out of the box, so that we have not to setup that manually. Since i also never worked with MongoDB i decided to use the object modeling tool mongosse which is also supported by NestJs.

P.S.: Sorry i forgot to keep the commit history clean an granular :)

## Installation

```bash
$ npm install
```

## Running the app

The up can run on any machine without setting up mongoDB because a public availabe mongoDB instace is used. Thanks to https://www.mongodb.com/cloud/atlas Free tier.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

Currently there exists only unit test. In the feature e2e and integration tests should be added.

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## TODOs

- Documentation
- Remove the \_id field or use it for the key
- In case of an expired cache hit or chache miss, the response contains \$setOnInsert property
- Does the Cache#get method need to be atomic to prevent overriding cache entries?
- Add typings return value remove & removeAll
- Create service for logging
