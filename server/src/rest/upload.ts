import * as multer from 'multer'
import * as fs from 'fs'
import { SCHEMAS_DIR } from '../constants'

const storage = multer.diskStorage({
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

var upload = multer({
  limits: {
    // Maximum file size in bytes (here, 100Mo)
    fileSize: 100 * 1024 * 1024,
  },
  storage,
})

export default (server: any) => {
  server.post('/upload', upload.single('schema'), (req: any, res: any) => {
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
  })

  server.get('/schemas/:filename', (req: any, res: any) => {
    res.sendFile(`${SCHEMAS_DIR!}/${req.params.filename}`, (err: any) => {
      if (err) {
        res.setHeader('Content-Type', 'application/json')
        res.status(err.status).send({ error: err, message: err.message })
      }
    })
  })
}
