const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const myGraphQLSchema = require('./schema');

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: myGraphQLSchema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log('Server 4000 numaralı portta çalışıyor');
})