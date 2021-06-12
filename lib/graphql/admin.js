import { ApolloClient, InMemoryCache } from '@apollo/client';


export default new ApolloClient({
    uri: 'https://hasura.tdexi.com/v1/graphql',
    cache: new InMemoryCache(),
    headers: {
      'x-hasura-admin-secret': "QrV2KvcXXpO0NrEVx45dW9Pag0L2"
    }
  });