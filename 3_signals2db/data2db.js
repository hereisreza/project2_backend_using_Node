async function main () {
  const n = 100
  const nAnalyst = 5
  const dbName = 'fin_db_2'
  let signals = []
  for (let i = 0; i < n; i++) {
    signals = signals.concat({
      signalNumber: i,
      status: ['open', 'target', 'stop'][Math.floor(Math.random() * 3)]
    })
  }
  // console.log(signals)

  let decisions = []
  for (let i = 0; i < n; i++) {
    decisions = decisions.concat({
      analyst: 'Analyst_' + String(Math.floor(Math.random() * nAnalyst)),
      signal: i,
      analystDecision: ['confirm', 'reject'][Math.floor(Math.random() * 2)]
    })
  }
  // console.log(decisions)

  const MongoClient = require('mongodb').MongoClient
  const url = 'mongodb://localhost:27017/'

  const client = new MongoClient(url)
  await client.connect()
  await client.db(dbName).collection('signals').insertMany(signals)
  await client.db(dbName).collection('decisions').insertMany(decisions)
  console.log('Done!')
  await client.close()

  return 0
}
main()
