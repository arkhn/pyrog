import { isAbsolute } from 'path'

import * as express from 'express'
import Multer, { diskStorage } from 'multer'
import * as fs from 'fs'
import { SCHEMAS_DIR } from '../constants'

if (!SCHEMAS_DIR) {
  throw new Error('Error: SCHEMA_DIR must be defined first!');
}

if (!fs.existsSync(SCHEMAS_DIR)) {
  fs.mkdirSync(SCHEMAS_DIR);
}

const storage = diskStorage({
  destination(req, file, cb) {
    cb(null, `${SCHEMAS_DIR!}/`)
  },
  filename(req, file, cb) {
    let name = `${file.originalname}.json`

    if (fs.existsSync(`${SCHEMAS_DIR!}/${name}`)) {
      name = `${(Math.random() + 1).toString(36).substring(2, 5)}.json`
    }

    cb(null, name)
  },
})

var upload = Multer({
  limits: {
    // Maximum file size in bytes (here, 100Mo)
    fileSize: 100 * 1024 * 1024,
  },
  storage,
})

export default (server: any) => {
  server.post(
    '/upload',
    upload.single('schema'),
    (req: express.Request, res: express.Response) => {
      console.log(
        req.file && req.file.originalname
          ? `Uploading ${req.file.originalname}.json...`
          : 'No File Uploaded',
      )

      res.send({
        message:
          req.file && req.file.originalname
            ? 'Schéma uploadé'
            : 'Une erreur est survenue',
        success: req.file && req.file.originalname,
      })
    },
  )

  server.get(
    '/schemas/:filename',
    (req: express.Request, res: express.Response) => {
      const opts: any = {}
      const path = `${SCHEMAS_DIR!}/${req.params.filename}`
      if (!isAbsolute(path)) {
        opts.root = process.cwd()
      }

      res.sendFile(
        `${SCHEMAS_DIR!}/${req.params.filename}`,
        opts,
        (err: any) => {
          if (err) {
            res.setHeader('Content-Type', 'application/json')
            res.status(err.status).send({ error: err, message: err.message })
          }
        },
      )
    },
  )
}
