const { Client } = require('pg');
const connectionString = process.env.PRISMA_ENDPOINT;
const client = new Client({
  connectionString: connectionString
});

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const wait = async () => {
  let ok = false;
  for (let index = 0; index < 15; index++) {
    try {
      await client.connect();
      ok = true;
      break;
    } catch {
      console.log('.');
      await sleep(1000);
      continue;
    }
  }
  if (!ok) {
    throw new Error('Prisma seems unavailable');
  }
  await client.end();
};

console.log('Waiting for prisma...');
console.log(connectionString);
wait().catch(e => {
  console.error(e);
});
