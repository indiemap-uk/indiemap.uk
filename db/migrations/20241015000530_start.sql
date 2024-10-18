-- migrate:up
CREATE TABLE "public"."counties" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    PRIMARY KEY ("id"),
    "name" varchar NOT NULL
);

CREATE TABLE "public"."towns" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    PRIMARY KEY ("id"),
    "name" varchar NOT NULL,
    "county_id" uuid NOT NULL,
    CONSTRAINT "towns_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "public"."counties"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "public"."indies" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    PRIMARY KEY ("id"),
    "name" varchar NOT NULL,
    "description" text,
    "town_id" uuid NOT NULL,
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
DROP TABLE "public"."counties";
