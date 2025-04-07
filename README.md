# Indiemap.uk

> All the wonderful stuff made by independent creators in the UK

## Env setup

If you start from scratch:

```sh
cp .envrc.sample .envrc
```

## First run

```sh
pnpm install
# starts a postgres server in a docker container
pnpm -F repository db
# runs the migrations, create tables and loads town data
pnpm -F repository db:up
# starts the web app
pnpm -F web dev
```
