const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const db = require('./db')

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
type Pair {
    _id: ID
    open: Float
    high: Float
    low: Float
    close: Float
    volume: Float
  }
  type Query {
    pair(name: String): [Pair]
  }
`)

// The root provides a resolver function for each API endpoint
const root = {
  pair: (name) => {
    return db.dbFunc(name)
  }
}

const app = express()
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))
app.listen(4000)
console.log('Running a GraphQL API server at http://localhost:4000/graphql')
