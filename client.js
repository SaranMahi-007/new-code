const { GraphQLClient } = require("graphql-request");

const client = new GraphQLClient("https://pockets-dev.digimeta.dev/v1/graphql", {
  headers: { "x-hasura-admin-secret": "Apid54as890vai67shu654na98vi" },
});
module.exports = { client };