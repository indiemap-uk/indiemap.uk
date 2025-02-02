# Indiemap.uk

> All the wonderful stuff made by independent creators in the UK

```sh
pnpm install
pnpm -F repository db # starts a postgres server in a docker container
# Make sure DATABASE_URL is in your env!
cp .envrc.sample .envrc
direnv allow
pnpm -F repository db:up # runs the migrations, create tables and loads town data
pnpm -F web dev
```
