-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "keyv" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"value" text
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" varchar(90) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"description" text,
	"name" varchar NOT NULL,
	"town_id" integer,
	"updated_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'live' NOT NULL,
	"generated_from_urls" jsonb DEFAULT '[]'::jsonb,
	CONSTRAINT "businesses_status_check" CHECK (status = ANY (ARRAY['live'::text, 'draft'::text]))
);
--> statement-breakpoint
CREATE TABLE "links" (
	"id" varchar(90) PRIMARY KEY NOT NULL,
	"business_id" varchar(90) NOT NULL,
	"label" text,
	"url" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uk_towns" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(56),
	"county" varchar(32),
	"country" varchar(16),
	"grid_reference" varchar(8),
	"easting" integer,
	"northing" integer,
	"latitude" numeric(8, 5),
	"longitude" numeric(8, 5),
	"elevation" integer,
	"postcode_sector" varchar(6),
	"local_government_area" varchar(44),
	"nuts_region" varchar(24),
	"type" varchar(13)
);
--> statement-breakpoint
CREATE TABLE "business_locations" (
	"business_id" varchar(90) NOT NULL,
	"location_id" varchar(90) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" varchar(90) PRIMARY KEY NOT NULL,
	"address" text,
	"label" text,
	"latitude" numeric(8, 5),
	"longitude" numeric(8, 5)
);
--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_town_id_fkey" FOREIGN KEY ("town_id") REFERENCES "public"."uk_towns"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "business_locations" ADD CONSTRAINT "business_locations_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "business_locations" ADD CONSTRAINT "business_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
*/
