CREATE SCHEMA "authjs";
--> statement-breakpoint
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
