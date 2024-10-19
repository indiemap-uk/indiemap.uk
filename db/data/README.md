# UK Town Data

`towns.sql`: all UK towns, purchased from http://townslist.co.uk/

Contains all 49,225 UK cities, towns, villages and suburbs

# Import

The table (schema) is created by the migrations but the data must be manually imported to any database using it:

```sh
pnpm run db:towns
```

# The SQL schema

```sql
CREATE TABLE towns (
  id int NOT NULL,
  name varchar(56),
  county varchar(32),
  country varchar(16),
  grid_reference varchar(8),
  easting int,
  northing int,
  latitude numeric(8, 5),
  longitude numeric(8, 5),
  elevation int,
  postcode_sector varchar(6),
  local_government_area varchar(44),
  nuts_region varchar(24),
  type varchar(13),
  PRIMARY KEY (id)
)
```
