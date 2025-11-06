CREATE TYPE "public"."note_entity_type" AS ENUM('source');--> statement-breakpoint
CREATE TABLE "notes" (
	"id" varchar(90) PRIMARY KEY NOT NULL,
	"entity_type" "note_entity_type" NOT NULL,
	"entity_id" varchar(90) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
