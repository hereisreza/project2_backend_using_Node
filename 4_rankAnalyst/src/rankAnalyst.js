async function main () {
  const MongoClient = require('mongodb').MongoClient
  const url = 'mongodb://localhost:27017/'
  const dbName = 'fin_db_2'

  const client = new MongoClient(url)
  await client.connect()

  let rank = []
  const query1 = {}
  const decisions = await client.db(dbName).collection('decisions').find(query1).toArray()
  const analystsRaw = decisions.map(a => a.analyst)
  const analysts = [...new Set(analystsRaw)].sort()
  console.log('Analysts Are ', analysts)
  for (const a in analysts) {
    const query1 = { analyst: analysts[a] }
    const allDecisions = await client.db('fin_db_2').collection('decisions').find(query1).toArray()
    const query2 = { $and: [{ analystDecision: 'confirm' }, query1] }
    const confirmedDecisionsRaw = await client.db('fin_db_2').collection('decisions').find(query2).toArray()
    const confirmedDecisions = confirmedDecisionsRaw.map(a => a.signal)
    let numTrue = 0
    for (const s in confirmedDecisions) {
      const query3 = { $or: [{ status: 'stop' }, { status: 'target' }] }
      const query4 = { $and: [{ signalNumber: confirmedDecisions[s] }, query3] }
      const trueDecisions = await client.db('fin_db_2').collection('signals').find(query4).toArray()
      numTrue += trueDecisions.length
    }
    console.log(analysts[a], ':', allDecisions.length, 'Decisions &',
      confirmedDecisionsRaw.length, 'Confirmed Decisions &', numTrue, 'True decisions.')
    rank = rank.concat({
      analyst: analysts[a],
      allDecisions: allDecisions.length,
      trueDecisions: numTrue,
      accuracy: (numTrue / allDecisions.length).toPrecision(2) * 100
    })
    rank = rank.sort(function (a, b) {
      return b.accuracy - a.accuracy
    })
  }
  await client.close()
  console.log('\n', rank)
  return rank
}
module.exports = main
main()
