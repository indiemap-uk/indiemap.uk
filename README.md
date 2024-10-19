# Indiemap.uk

> All the wonderful stuff made by independent creators in the UK


```sh
pnpm install
pnpm db # starts a postgres server in a docker container
# Make sure DATABASE_URL is in your env!
cp .envrc.sample .envrc
direnv allow
pnpm db:up # runs the migrations, create tables
pnpm db:towns # imports all UK towns into the db
```
