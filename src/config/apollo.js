const { ApolloServer, AuthenticationError } = require('apollo-server-express');

function configureApolloServer() {
  const server = new ApolloServer({

    schema: require('../graphql/schema'),
    context: ({req}) => ({
      user: req.user,
    }),
    formatResponse(body) {
      if (body.errors && body.errors.find(err => err.extensions && err.extensions.code === 'UNAUTHENTICATED')) {
        return {
          ...body,
          data: undefined,
        }
      }

      return body
    },
    plugins: [
      {
        requestDidStart(requestContext) {
          return {
            didEncounterErrors({ response, errors }) {
              if (errors.find(err => err instanceof AuthenticationError || err.originalError instanceof AuthenticationError)) {
                response.data = undefined;
                response.http.status = 401
              }
            }
          }
        }
      }
    ]

  });

  return server;
}

module.exports = configureApolloServer;