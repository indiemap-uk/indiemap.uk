CREATE TABLE "sources" (
	"id" varchar(90) PRIMARY KEY NOT NULL,
	"urls" varchar[] NOT NULL,
	"business_id" varchar(90)
);
--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "sources_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE set null ON UPDATE cascade;