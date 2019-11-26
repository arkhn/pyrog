import * as fs from 'fs';
import { GraphQLServer } from 'graphql-yoga';
import * as multer from 'multer';
import 'graphql-import-node';
import { Client as PgClient } from 'pg';
const crypto = require('crypto');

import * as Schema from './schema.graphql';

import {
  Prisma as PrismaClient,
  prisma as prismaClient
} from './generated/prisma-client';
import { Prisma as PrismaBinding } from './generated/prisma-binding';
import resolvers from './resolvers';

const endpoint =
  process.env.NODE_ENV == 'docker'
    ? 'http://prisma:4466'
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
  destination(req, file, cb) {
    cb(null, `${SCHEMAS_DEST}/`);
  },
  filename(req, file, cb) {
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
  storage
});

server.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

server.post('/upload', upload.single('schema'), function(req, res) {
  console.log(
    req.file && req.file.originalname
      ? `Uploading ${req.file.originalname}.json...`
      : 'No File Uploaded'
  );

  res.send({
    message:
      req.file && req.file.originalname
        ? 'Schéma uploadé'
        : 'Une erreur est survenue',
    success: req.file && req.file.originalname
  });
});

server.get('/schemas/:filename', function(req, res) {
  res.sendFile(
    `${process.env.STATIC_FILES_DIR}/schemas/${req.params.filename}`,
    (err: any) => {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(err.status).send({ error: err, message: err.message });
      }
    }
  );
});

server.get('/resource/:filename', function(req, res) {
  res.sendFile(
    `${process.env.STATIC_FILES_DIR}/fhirResources/${req.params.filename}`,
    (err: any) => {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(err.status).send({ error: err, message: err.message });
      }
    }
  );
});

server.get('/tableview/:sourceId/:tableName', async (req: any, res: any) => {
  // TODO
  // check authentication + user should be ADMIN

  // Load Source Crenditials and decipher password
  const cred = await prismaClient
    .source({ id: req.params.sourceId })
    .credential();
  console.log('CRED', cred);
  const decipher = crypto.createDecipher('aes256', process.env.APP_SECRET);
  const decryptedPassword =
    decipher.update(cred.password, 'hex', 'utf8') + decipher.final('utf8');
  console.log('DECR', decryptedPassword);

  // Connect to distant database
  const pgClient = new PgClient({
    host: cred.host,
    port: cred.port,
    database: cred.database,
    user: cred.login,
    password: decryptedPassword
  });

  console.log('PG CLIENT OK');

  pgClient.connect();
  console.log('PGCLIENT CONNECTED');

  // Query table and send results
  pgClient
    .query(`SELECT * FROM ${req.params.tableName} LIMIT 10;`)
    .then((data: any) => {
      console.log('RES OK', data);

      res.send({
        rows: data.rows,
        fields: data.fields
      });

      pgClient.end();
    })
    .catch((err: any) => {
      console.log('ERR', err);

      res.status(500).send({
        error: err,
        message: err.message
      });

      pgClient.end();
      throw new Error(err);
    });
});

const serverOptions = {
  port: process.env.SERVER_PORT
};

server.start(serverOptions, ({ port }) =>
  console.log(`Prisma endpoint: ${endpoint}
🚀 Server is running on http://localhost:${port}`)
);
