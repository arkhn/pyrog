/*
  Warnings:

  - You are about to drop the column `owner` on the `Credential` table. All the data in the column will be lost.
  - You are about to drop the column `schema` on the `Credential` table. All the data in the column will be lost.
  - You are about to drop the column `sqlValue` on the `Input` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[input]` on the table `Column`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[owner]` on the table `Column`. If there are existing duplicate values, the migration will fail.
  - Added the required column `input` to the `Column` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner` to the `Column` table without a default value. This is not possible if the table is not empty.

*/

-- !!!!!! Delete all columns with missing relations !!!!!!!!
-- These are legacy columns that should have been removed before
DELETE FROM "Attribute" WHERE "resource" is NULL;
DELETE FROM "InputGroup" WHERE "attributeId" is NULL;
DELETE FROM "Input" WHERE "inputGroupId" is NULL;
DELETE FROM "Join" WHERE "column" is NULL;
DELETE from "Filter" WHERE "resource" is NULL;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable Owner table and its index
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schema" JSONB,
    "credential" TEXT NOT NULL,

    PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Owner_name_credential_unique_constraint" ON "Owner"("name", "credential");

-- populate Owner table
INSERT INTO "Owner" (id, "name", "schema", "credential")
SELECT uuid_generate_v4(), c.owner, to_json(c.schema), c.id
FROM "Credential" c;

-- drop unused fields on table "Credential"
ALTER TABLE "Credential"
DROP COLUMN "owner",
DROP COLUMN "schema";

-- Move foreignKey Input.sqlValue to Column.input
DROP INDEX IF EXISTS "Input_sqlValue";
ALTER TABLE "Input" DROP CONSTRAINT "Input_sqlValue_fkey";

ALTER TABLE "Column"
ADD COLUMN     "input" TEXT;

UPDATE "Column" set "input" = "Input"."id"
FROM "Input"
WHERE "Input"."sqlValue" = "Column"."id";

ALTER TABLE "Input" DROP COLUMN "sqlValue";

-- Add "Owner" foreign key on "Column"
ALTER TABLE "Column"
ADD COLUMN     "owner" TEXT;

UPDATE "Column" set "owner" = _owner.id
FROM "Input" input
JOIN "InputGroup" input_group on input_group.id = input."inputGroupId"
JOIN "Attribute" attribute on attribute.id = input_group."attributeId"
JOIN "Resource" resource on resource.id = attribute.resource
JOIN "Source" source on source.id = resource.source
JOIN "Credential" cred on cred.source = source.id
JOIN "Owner" _owner on _owner.credential = cred.id
WHERE input.id = "Column".input;

UPDATE "Column" set "owner" = _owner.id
FROM "Join" _join
JOIN "Column" _col on _col.id = _join."column"
JOIN "Owner" _owner on _owner.id = _col."owner"
WHERE "Column".join = _join.id;

UPDATE "Column" set "owner" = _owner.id
FROM "Condition" condition
JOIN "InputGroup" input_group on input_group.id = condition."inputGroup"
JOIN "Attribute" attribute on attribute.id = input_group."attributeId"
JOIN "Resource" resource on resource.id = attribute.resource
JOIN "Source" source on source.id = resource.source
JOIN "Credential" cred on cred.source = source.id
JOIN "Owner" _owner on _owner.credential = cred.id
WHERE condition.column = "Column".id;

UPDATE "Column" set "owner" = _owner.id
FROM "Filter" _filter
JOIN "Resource" resource on resource.id = _filter.resource
JOIN "Source" source on source.id = resource.source
JOIN "Credential" cred on cred.source = source.id
JOIN "Owner" _owner on _owner.credential = cred.id
WHERE _filter."sqlColumn" = "Column".id;

-- !!!!!! Delete all columns with missing relations !!!!!!!!
-- These are legacy columns that should have been removed before
DELETE from "Column" WHERE "owner" is NULL;

-- Add "Owner" foreign key on "Column"
ALTER TABLE "Resource"
ADD COLUMN     "primaryKeyOwner" TEXT;

UPDATE "Resource" _resource set "primaryKeyOwner" = _owner.id
FROM "Source" source
JOIN "Credential" cred on cred.source = source.id
JOIN "Owner" _owner on _owner.credential = cred.id
WHERE _resource.source = source.id;

ALTER TABLE "Resource" ALTER COLUMN "primaryKeyOwner" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Column.input_unique" ON "Column"("input");

-- AddForeignKey
ALTER TABLE "Owner" ADD FOREIGN KEY("credential")REFERENCES "Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD FOREIGN KEY("input")REFERENCES "Input"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD FOREIGN KEY("owner")REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD FOREIGN KEY("primaryKeyOwner")REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
