-- CreateEnum
CREATE TYPE "DatabaseType" AS ENUM ('POSTGRES', 'ORACLE', 'MSSQL');

-- CreateEnum
CREATE TYPE "ConditionAction" AS ENUM ('INCLUDE', 'EXCLUDE');

-- CreateEnum
CREATE TYPE "ConditionRelation" AS ENUM ('EQ', 'LT', 'LE', 'GE', 'GT', 'NULL', 'NOTNULL');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "SourceRole" AS ENUM ('READER', 'WRITER');

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credential" (
    "database" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "port" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "model" "DatabaseType" NOT NULL,
    "owner" TEXT NOT NULL DEFAULT E'',
    "schema" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "label" TEXT,
    "primaryKeyColumn" TEXT,
    "primaryKeyTable" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "definitionId" TEXT NOT NULL,
    "logicalReference" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filter" (
    "id" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "resource" TEXT,
    "sqlColumn" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "resource" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "path" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "sliceName" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "attribute" TEXT,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "validation" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InputGroup" (
    "id" TEXT NOT NULL,
    "mergingScript" TEXT,
    "attributeId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Input" (
    "id" TEXT NOT NULL,
    "sqlValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "script" TEXT,
    "staticValue" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "conceptMapId" TEXT,
    "inputGroupId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Column" (
    "id" TEXT NOT NULL,
    "join" TEXT,
    "column" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "table" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Join" (
    "id" TEXT NOT NULL,
    "column" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" TEXT NOT NULL,
    "action" "ConditionAction",
    "column" TEXT,
    "value" TEXT,
    "inputGroup" TEXT NOT NULL,
    "relation" "ConditionRelation" NOT NULL DEFAULT E'EQ',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessControl" (
    "id" TEXT NOT NULL,
    "role" "SourceRole" NOT NULL,
    "source" TEXT NOT NULL,
    "user" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Template.name_unique" ON "Template"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Source_templateId_name" ON "Source"("template", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Credential.source_unique" ON "Credential"("source");

-- CreateIndex
CREATE UNIQUE INDEX "Filter.sqlColumn_unique" ON "Filter"("sqlColumn");

-- CreateIndex
CREATE UNIQUE INDEX "Input.sqlValue_unique" ON "Input"("sqlValue");

-- CreateIndex
CREATE UNIQUE INDEX "Condition.column_unique" ON "Condition"("column");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AccessControl_user_source" ON "AccessControl"("user", "source");

-- AddForeignKey
ALTER TABLE "Source" ADD FOREIGN KEY("template")REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD FOREIGN KEY("source")REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD FOREIGN KEY("source")REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filter" ADD FOREIGN KEY("resource")REFERENCES "Resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filter" ADD FOREIGN KEY("sqlColumn")REFERENCES "Column"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD FOREIGN KEY("resource")REFERENCES "Resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY("attribute")REFERENCES "Attribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY("author")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InputGroup" ADD FOREIGN KEY("attributeId")REFERENCES "Attribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Input" ADD FOREIGN KEY("inputGroupId")REFERENCES "InputGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Input" ADD FOREIGN KEY("sqlValue")REFERENCES "Column"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD FOREIGN KEY("join")REFERENCES "Join"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Join" ADD FOREIGN KEY("column")REFERENCES "Column"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condition" ADD FOREIGN KEY("column")REFERENCES "Column"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condition" ADD FOREIGN KEY("inputGroup")REFERENCES "InputGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessControl" ADD FOREIGN KEY("source")REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessControl" ADD FOREIGN KEY("user")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
