import * as multer from 'multer'
import * as fs from 'fs'

// TODO put db schemas in a folder
const SCHEMAS_DEST = `${__dirname}` //`${process.env.STATIC_FILES_DIR}/schemas`;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${SCHEMAS_DEST}/`)
  },
  filename(req, file, cb) {
    let name = `${file.originalname}.json`

    if (fs.existsSync(`${SCHEMAS_DEST}/${name}`)) {
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
    res.sendFile(`${__dirname}/${req.params.filename}`, (err: any) => {
      if (err) {
        res.setHeader('Content-Type', 'application/json')
        res.status(err.status).send({ error: err, message: err.message })
      }
    })
  })
}
