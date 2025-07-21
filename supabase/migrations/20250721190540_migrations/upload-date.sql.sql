alter table "public"."images" drop column "created_at";

alter table "public"."images" add column "upload_date" timestamp with time zone default now();


