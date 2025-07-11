alter table "public"."images" drop column "date";

alter table "public"."images" add column "created_at" timestamp with time zone default now();

alter table "public"."images" add column "image_date" date not null;


