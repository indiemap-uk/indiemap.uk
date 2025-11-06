# Indiemap.uk

> All the wonderful stuff made by independent creators in the UK

# Env setup

If you start from scratch:

```sh
cp .envrc.sample .envrc
```

# UK Town Data

Indiemap relies on the UK town data available from https://www.townslist.co.uk/.

For the proper functionality the full data-set (a paid product) must be loaded into the production database.
For development purposes you can use [the free sample](https://www.townslist.co.uk/sample/).

# First run

```sh
# install dependencies
pnpm install

# run a postgres server locally - you need docker
# alternatively you can connect to a remote DB, see .envrc
pnpm dc:up

# create tables in the DB
pnpm mig:up

# install the UK Town data (see UK Town Data)
# if you have the towns.sql file, run pnpm towns
# if you do not have towns.sql, generate fake towns with
# pnpm mock:towns
pnpm towns

# Start local dev server
pnpm dev
```

# Docker

To build the docker image (for local development):

```sh
pnpm docker:build
```

# Tests

Some tests require a database connection, these have `@db` in their name.
The modules that have such tests add a `test:db` script to package.json and
the normal test script ignores the `@db` tests:

```json
{
  "test": "vitest run -t '^(?!.*@db).*$' --hideSkippedTests",
  "test:db": "vitest run -t '@db' --hideSkippedTests"
}
```
