import { ApolloClient, InMemoryCache } from '@apollo/client';


export default new ApolloClient({
    uri: 'http://165.232.180.39/v1/graphql',
    cache: new InMemoryCache(),
    headers: {
      'x-hasura-admin-secret': "QrV2KvcXXpO0NrEVx45dW9Pag0L2"
    }
  });