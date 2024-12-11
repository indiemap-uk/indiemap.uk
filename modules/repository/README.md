# Repository

> Data persistence layer

# UK Town Data

Indiemap relies on the UK town data available from https://www.townslist.co.uk/.

For the proper functionality the full data-set (a paid product) must be loaded into the production database.
For development purposes you can use [the free sample](https://www.townslist.co.uk/sample/).

First run the DB migration scripts:

```sh
pnpm -F repository mig:up
```

Then copy the data to `repository/towns/towns.sql` and run

```sh
pnpm -F repository towns
```

# Development database

To spin up a Postgres DB in Docker, run the migrations and load the town data in one go:

```sh
pnpm -F repository db:up
```
