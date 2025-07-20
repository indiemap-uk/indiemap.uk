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
