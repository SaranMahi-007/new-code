const jwt = require('jsonwebtoken');

const HASURA_GRAPHQL_JWT_SECRET = {
  type: "HS256",
  key: "efb3ed72f374712914a4a8d642c7370f",
};

const JWT_CONFIG = {
  algorithm: HASURA_GRAPHQL_JWT_SECRET.type,
  expiresIn: "1h"
};

function generateJWT(params) {
  const payload = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": params.allowedRoles,
      "x-hasura-default-role": params.defaultRole,
      ...params.otherClaims,
    },
  };
  return jwt.sign(payload, HASURA_GRAPHQL_JWT_SECRET.key, JWT_CONFIG);
}

module.exports = { generateJWT };
