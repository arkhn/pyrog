import { Client } from 'pg'

const { POSTGRES_URL } = process.env
const client = new Client({
  connectionString: POSTGRES_URL,
})

const sleep = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

const wait = async () => {
  let ok = false
  for (let index = 0; index < 15; index++) {
    try {
      await client.connect()
      ok = true
      break
    } catch {
      console.log('.')
      await sleep(1000)
      continue
    }
  }
  if (!ok) {
    throw new Error('database is not available')
  }
  await client.end()
}

console.log('Waiting for postgres...', POSTGRES_URL)
wait().catch(e => {
  console.error(e)
})
