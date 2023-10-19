const { GraphQLClient } = require("graphql-request");

const client = new GraphQLClient("https://web.pocketgiving.co.uk/v1/graphql", {
  headers: { "x-hasura-admin-secret": "AcdBFQjcVnQW987Py9785MvJ7567" },
});
module.exports = { client };