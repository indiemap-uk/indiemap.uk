CREATE SCHEMA "authjs";
--> statement-breakpoint
CREATE TYPE "public"."business_status" AS ENUM('live', 'draft');--> statement-breakpoint
CREATE TABLE "authjs"."accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" bigint,
	"id_token" text,
	"scope" text,
	"session_state" text,
	"token_type" text
);
--> statement-breakpoint
CREATE TABLE "authjs"."sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"sessionToken" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authjs"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"emailVerified" timestamp with time zone,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "authjs"."verification_token" (
	"identifier" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "business_locations" (
	"business_id" varchar(90) NOT NULL,
	"location_id" varchar(90) NOT NULL,
	CONSTRAINT "business_locations_business_id_location_id_pk" PRIMARY KEY("business_id","location_id")
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" varchar(90) PRIMARY KEY NOT NULL,
	"description" text,
	"name" varchar NOT NULL,
	"status" "business_status" DEFAULT 'live' NOT NULL,
	"town_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "links" (
	"id" varchar(90) PRIMARY KEY NOT NULL,
	"business_id" varchar(90) NOT NULL,
	"label" text,
	"url" varchar NOT NULL
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
CREATE TABLE "products" (
	"id" varchar(90) PRIMARY KEY NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"business_id" varchar(90),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" varchar(90) PRIMARY KEY NOT NULL,
	"urls" varchar[] NOT NULL,
	"business_id" varchar(90),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
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
ALTER TABLE "business_locations" ADD CONSTRAINT "business_locations_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "business_locations" ADD CONSTRAINT "business_locations_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_town_id_uk_towns_id_fk" FOREIGN KEY ("town_id") REFERENCES "public"."uk_towns"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "sources_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE set null ON UPDATE cascade;