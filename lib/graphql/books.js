import { gql } from '@apollo/client';


export const QUERY_BOOKS_BY_LOCATION = gql`
query MyQuery($from: geography!, $distance: Float!) {
    Books(where: {User: {location: {_st_d_within: {distance: $distance, from: $from}}}}, order_by: {User: {location: desc}}) {
      id
      name
      User {
        location
      }
    }
  }  
`;

export const INSERT_BOOK = gql`
mutation MyMutation($author_id: Int!, $name: String!, $user_id: String!) {
    insert_Books_one(object: {author_id: $author_id, name: $name, user_id: $user_id}) {
      id
    }
  }
`;