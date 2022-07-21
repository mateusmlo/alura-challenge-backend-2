<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# Finance Control API

## Stack:
- NestJS
- Docker
- MongoDB Atlas
- Passport
- Redis
- JWT

## Description

This project was made as an entry to a back-end challenge from [Alura](https://www.alura.com.br/). It consists of an API where users can sign-up, sign-in, then have access to a few routes with which they can register monthly expenses, receipts, do CRUD ops and generate summaries based on data from both features. This project is pretty much finished, I know some things could've been better and e2e tests are still missing but I've spent enough time working on this, so I plan to improve things and take a step farther on my next one.

### Key Features:
- Create, update, get and delete expenses, which may be categorized. Duplicate expenses are not allowed on the same month.
- Same as above for receipts but categories are not available.
- Generate a monthly summary listing the total receipts, expenses, profit, and expenses categorized.
- Routes protected by JWTs, and thanks to the @CurrentUser() interceptor, the current logged-in user is automatically retrieved on each request.
- Refresh tokens for durable sessions and Redis validation for that sexy speed. I didn't think response caching was necessary.

## REPL (New🌟):
On your terminal, run `yarn repl` and the application will start in REPL mode, allowing you to test the methods directly (no need to open Postman or Insomnia for simple routes!). Usage of this neat feature can be found in the [Official docs](https://docs.nestjs.com/recipes/repl).

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start:

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```

## TODO:
- [ ] CI/CD
- [ ] Dockerize MongoDB
- [ ] Swagger
