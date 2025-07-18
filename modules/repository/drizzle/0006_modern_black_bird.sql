CREATE TABLE "products" (
	"id" varchar(90) PRIMARY KEY NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"business_id" varchar(90),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE set null ON UPDATE cascade;