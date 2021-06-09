
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

import { setContext } from '@apollo/client/link/context';
import * as ws from 'ws';



const HTTPS_URL = "http://165.232.180.39/v1/graphql"
const WSS_URL = "ws://165.232.180.39/v1/graphql"
const HASURA_SECRET = "QrV2KvcXXpO0NrEVx45dW9Pag0L2"

// console.log(HTTPS_URL, WSS_URL, HASURA_SECRET)


// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const token = localStorage.getItem('token');
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       'x-hasura-admin-secret': HASURA_SECRET
//         //   authorization: token ? `Bearer ${token}` : "",
//     }
//   }
// });



const httpsLink = new HttpLink({
    uri: HTTPS_URL,
    headers: {
      'x-hasura-admin-secret': HASURA_SECRET
    // // 'x-hasura-role': "employer",
    // // 'x-hasura-employer-Id': 1
    }
  });
  
  const wssLink = process.browser ? new WebSocketLink({
    uri: WSS_URL,
    options: {
      reconnect: true,
      connectionParams: {
          'x-hasura-admin-secret': HASURA_SECRET
      }
    },
  }) : null;

//   const wssLink = process.browser ? new WebSocketLink({
//     uri: WSS_URL,
//     options: {
//       lazy: true,
//       reconnect: true,
//       connectionParams: async () => {
//         const token = localStorage.getItem('token');
//         // const token = await getToken();
//         return {
//           headers: {
//             'x-hasura-admin-secret': HASURA_SECRET
//             // Authorization: token ? `Bearer ${token}` : "",
//           },
//         }
//       },
//     },
//   }) : null
  
//   const link = split(
//     ({ query }) => {
//       const definition = getMainDefinition(query);
//       return (
//         definition.kind === 'OperationDefinition' &&
//         definition.operation === 'subscription'
//       );
//     },
//     // wssLink,
//     httpsLink,
//   );



  const link = process.browser ? split( //only create the split in the browser
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wssLink,
    httpsLink,
  ) : httpsLink;


  
  const createApolloClient = () => {
    return new ApolloClient({
      cache: new InMemoryCache(),
      link//: authLink.concat(link)
    });
  };
  


export const client = createApolloClient();
