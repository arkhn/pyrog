import * as fs from "fs";
import { GraphQLServer } from "graphql-yoga";
import * as multer from "multer";
import "graphql-import-node";

import * as Schema from "./schema.graphql";

import { Prisma as PrismaClient } from "./generated/prisma-client";
import { Prisma as PrismaBinding } from "./generated/prisma-binding";
import resolvers from "./resolvers";

const endpoint =
  process.env.NODE_ENV == "docker"
    ? "http://prisma:4466"
    : process.env.PRISMA_ENDPOINT;

const SCHEMAS_DEST = `${process.env.STATIC_FILES_DIR}/schemas`;

const server = new GraphQLServer({
  typeDefs: Schema,
  // Resolvers have different types in various dependencies.
  // A quick workaround consists in any-casting resolvers.
  // This issue can be tracked here:
  // https://github.com/prisma/graphqlgen/issues/15#issuecomment-461024244
  resolvers: resolvers as any,
  resolverValidationOptions: { requireResolversForResolveType: false },
  context: request => ({
    ...request,
    binding: new PrismaBinding({
      endpoint,
      debug: true
    }),
    client: new PrismaClient({
      endpoint,
      debug: true
    })
  })
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `${SCHEMAS_DEST}/`);
  },
  filename: function(req, file, cb) {
    let name = `${file.originalname}.json`;

    if (fs.existsSync(`${SCHEMAS_DEST}/${name}`)) {
      name = `${(Math.random() + 1).toString(36).substring(2, 5)}.json`;
    }

    cb(null, name);
  }
});

var upload = multer({
  limits: {
    // Maximum file size in bytes (here, 100Mo)
    fileSize: 100 * 1024 * 1024
  },
  storage: storage
});

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

server.post("/upload", upload.single("schema"), function(req, res, next) {
  console.log(
    req.file && req.file.originalname
      ? `Uploading ${req.file.originalname}.json...`
      : "No File Uploaded"
  );

  res.send({
    message:
      req.file && req.file.originalname
        ? "Schéma uploadé"
        : "Une erreur est survenue",
    success: req.file && req.file.originalname
  });
});

server.get("/schemas/:filename", function(req, res) {
  res.sendFile(
    `${process.env.STATIC_FILES_DIR}/schemas/${req.params.filename}`,
    (error: any) => {
      console.log(error);
    }
  );
});

server.get("/resource/:filename", function(req, res) {
  res.sendFile(
    `${process.env.STATIC_FILES_DIR}/fhirResources/${req.params.filename}`,
    (error: any) => {
      console.log(error);
    }
  );
});

const serverOptions = {
  port: process.env.SERVER_PORT
};

server.start(serverOptions, ({ port }) =>
  console.log(`Prisma endpoint: ${endpoint}
🚀 Server is running on http://localhost:${port}`)
);
