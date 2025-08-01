# Indiemap.uk

> All the wonderful stuff made by independent creators in the UK

# Env setup

If you start from scratch:

```sh
cp .envrc.sample .envrc
```

# First run

```sh
pnpm install
# starts a postgres server in docker, create tables and load data
# You need the UK town .sql file, see README.md in repository!
pnpm -F repository db:up
# Start local dev server
pnpm -F web dev
```

# Docker

To build the docker image (for local development):

```sh
pnpm docker:build
```

To run the docker image connected to the local database:

```sh
pnpm docker:run
```

# Tests

Some tests require a database connection, these have `@db` in their name.
The modules that have such tests add a `test:db` script to package.json and
the normal test script ignores the `@db` tests:

```json
"test": "vitest run -t '^(?!.*@db).*$' --hideSkippedTests",
"test:db": "vitest run -t '@db' --hideSkippedTests",
```
