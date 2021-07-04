import { gql } from '@apollo/client';

export const QUERY_USER_BOOK_INTEREST = gql`
query MyQuery($book_id: Int!, $user_id: String!) {
    interests(where: {book_id: {_eq: $book_id}, user_id: {_eq: $user_id}, approved: {_is_null: true}}) {
      id
    }
  }  
`

export const SHOW_INTEREST_IN_BOOK = gql`
mutation MyMutation($book_id: Int!, $user_id: String!) {
    insert_interests_one(object: {book_id: $book_id, user_id: $user_id}) {
      id
    }
  }
`


export const QUERY_USER_ALL_INTEREST_BOOKS = gql`
query MyQuery($user_id: String!) {
    interests(where: {user_id: {_eq: $user_id}}, order_by: {created_at: desc}) {
      id
      created_at
      approved
      Book {
        name
        book_authors {
          Author {
            name
          }
        }
      }
    }
  }  
`


export const ACCEPT_INTEREST = gql`
mutation MyMutation($id: Int!, $book_id: Int!) {
    update_interests_by_pk(pk_columns: {id: $id}, _set: {approved: true}) {
      id
    }
    update_interests(where: {book_id: {_eq: $book_id}, approved: {_is_null: true}}, _set: {approved: false}) {
      affected_rows
    }
    update_Books_by_pk(pk_columns: {id: $book_id}, _set: {taken: true}){
      id
    }
  }
  
`

export const REJECT_INTEREST = gql`
mutation MyMutation($id: Int!) {
    update_interests_by_pk(pk_columns: {id: $id}, _set: {approved: false}) {
      id
    }
  }
`