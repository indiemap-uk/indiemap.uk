-- migrate:up
-- To install the town data read db/data/README.md
CREATE TABLE "public"."towns" (
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
);

CREATE TABLE "public"."indies" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    PRIMARY KEY ("id"),
    "name" varchar NOT NULL,
    "description" text,
    "town_id" int NOT NULL,
    CONSTRAINT "indies_town_id_fkey" FOREIGN KEY ("town_id") REFERENCES "public"."towns"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "public"."links" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    PRIMARY KEY ("id"),
    "url" varchar NOT NULL,
    "label" text,
    "indie_id" uuid NOT NULL,
    CONSTRAINT "links_indie_id_fkey" FOREIGN KEY ("indie_id") REFERENCES "public"."indies"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- migrate:down
DROP TABLE "public"."links";
DROP TABLE "public"."indies";
DROP TABLE "public"."towns";
