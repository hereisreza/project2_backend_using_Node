/* eslint new-cap: ["error", { "newIsCap": false }] */

async function main (name) {
  // name is the pair like "BTC/USDT"
  // dbName is like  "fin_db"
  const dbName = 'fin_db_2'
  const MongoClient = require('mongodb').MongoClient
  const url = 'mongodb://localhost:27017/'

  const client = new MongoClient(url)
  await client.connect()
  // const databasesList = await client.db().admin().listDatabases()
  // console.log("Databases:");
  // databasesList.databases.forEach(db => console.log(` - ${db.name}`));

  const ccxt = require('ccxt')
  // console.log (ccxt.exchanges);
  const binance = new ccxt.binance({
    id: 'binance',
    enableRateLimit: true
    // 'rateLimit': 2000,
  })
  // binance.options['adjustForTimeDifference'] = false
  // binance.setSandboxMode(true)
  // const markets = await binance.load_markets()
  // console.log (binance.id, markets)
  let startDate = new Date(2017, 0, 1).getTime()
  const endDate = new Date().getTime()
  let data = []
  console.log('Recieving Data ...')

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  const timeOffset = 1000 * 60 * 60 * 24 // 24 hour
  if (binance.has.fetchOHLCV) {
    while (endDate - timeOffset > startDate) {
      console.log('Getting OHLCV data for ', name, 'from ', new Date(startDate), ':')
      await sleep(binance.rateLimit) // milliseconds
      const dataTemp = await binance.fetchOHLCV(name, '1d', startDate, 500) // one minute
      const date1 = new Date(dataTemp[0][0])
      const date2 = new Date(dataTemp[dataTemp.length - 1][0])
      console.log('Data Recieved.')
      console.log([date1.toLocaleString('sv'), date2.toLocaleString('sv')].join(' to '))
      // console.log([date1.getTime(), date2.getTime()].join(' to '))
      console.log('Length = ', dataTemp.length, '\n')
      for (const i in dataTemp) {
        // console.log(dataTemp[i])
        data = data.concat({
          _id: dataTemp[i][0],
          open: dataTemp[i][1],
          high: dataTemp[i][2],
          low: dataTemp[i][3],
          close: dataTemp[i][4],
          volume: dataTemp[i][5]
        })
      }
      // console.log(data)
      startDate = date2.getTime() + 1
    }
  }

  await client.db(dbName).collection(name).insertMany(data)
  console.log('Done!')
  // console.log(a.insertedIds);
  await client.close()

  return 0 // a
}
main('BTC/USDT')
// export let res = main;
