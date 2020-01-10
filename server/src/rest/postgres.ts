import { Client } from 'pg'

import { Photon } from '@prisma/photon'
import { decrypt } from 'utils'

const photon = new Photon()

export default (server: any) => {
  server.get('/tableview/:sourceId/:tableName', async (req: any, res: any) => {
    // TODO
    // check authentication + user should be ADMIN

    // Load Source Crenditials and decipher password
    const source = await photon.sources.findOne({
      where: { id: req.params.sourceId },
      include: { credential: true },
    })
    if (!source) {
      return res.status(500).send({
        message: `Source not found for id ${req.params.sourceId}`,
      })
    }
    if (!source.credential) {
      return res.status(500).send({
        message: `Credential not found for source ${source.name}`,
      })
    }
    const decryptedPassword = decrypt(source.credential.password)

    // Connect to distant database
    const pgClient = new Client({
      host: source.credential.host,
      port: Number(source.credential.port),
      database: source.credential.database,
      user: source.credential.login,
      password: decryptedPassword,
    })

    await pgClient.connect()

    // Query table and send results
    try {
      const data = await pgClient.query(
        `SELECT * FROM ${req.params.tableName} LIMIT 10;`,
      )
      res.send({
        rows: data.rows,
        fields: data.fields,
      })
      await pgClient.end()
    } catch (err) {
      res.status(500).send({
        error: err,
        message: err.message,
      })

      await pgClient.end()
    }
  })
}
