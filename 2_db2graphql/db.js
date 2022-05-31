async function dbFunc (name) {
  const MongoClient = require('mongodb').MongoClient
  const url = 'mongodb://localhost:27017/'

  const client = new MongoClient(url)
  await client.connect()
  // const databasesList = await client.db().admin().listDatabases()
  // console.log('Databases:')
  // databasesList.databases.forEach(db => console.log(` - ${db.name}`))

  const query1 = {}
  const a = await client.db('fin_db_2').collection(name.name).find(query1).toArray()
  return a
}

module.exports = { dbFunc }
