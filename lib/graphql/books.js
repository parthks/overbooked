import { gql } from '@apollo/client';


export const QUERY_BOOKS_BY_LOCATION = gql`
query MyQuery($from: geography!, $distance: Float!) {
    Books(where: {User: {location: {_st_d_within: {distance: $distance, from: $from}}}}, order_by: {User: {location: desc}}) {
      id
      name
      isbn
      type
      cover_image
      User {
        location
      }
    }
  }  
`;

export const QUERY_BOOK_BY_PK = gql`
query MyQuery($id: Int!) {
    Books_by_pk(id: $id) {
      id
      name
      isbn
      type
      cover_image
      book_authors {
        Author {
          id
          name
        }
      }
    }
  } 
`

export const QUERY_BOOK_BY_UID = gql`
query MyQuery($uid: String!) {
  Books(where: {user_id: {_eq: $uid}}) {
    id
    name
    isbn
    type
    cover_image
    approved
    message
    taken
    interests(order_by: {created_at: desc, approved: desc}) {
      id
      approved
      User {
        name
        email
        phone_number
        notification_email
        notification_phone
        location
      }
    }
    book_authors {
      Author {
        id
        name
      }
    }
  }
}
`

export const QUERY_ALL_BOOKS = gql`
query MyQuery($search: String = "%%", $type: String = "%%") {
  Books(where: {_or: [{book_authors: {Author: {name: {_ilike: $search}}}}, {name: {_ilike: $search}}], approved: {_eq: true}, taken: {_eq: false}, type: {_ilike: $type}}) {
    id
    name
    type
    cover_image
    book_authors {
      Author {
        name
      }
    }
  }
}

`;

export const QUERY_RECENT_BOOKS = gql`
query MyQuery {
  Books(limit: 6, order_by: {id: desc}, where: {approved: {_eq: true}}) {
    id
    name
    type
    cover_image
    book_authors {
      Author {
        name
      }
    }
  }
}
`;


export const INSERT_BOOK = gql`
mutation MyMutation($object: Books_insert_input!) {
    insert_Books_one(object: $object) {
      id
    }
  }
`;





/*
UPDATE_BOOK variables
{
  "name": "new name",
  "type": "fiction"
  "id": 43,
  "object": [
     {"author_id": 4, "book_id": 43},
    {"author_id": 5, "book_id": 43},
    {"author_id": 10, "book_id": 43}
  ]
}

*/
export const UPDATE_BOOK = gql`
mutation MyMutation($name: String!, $type: String!, $id: Int!, $cover_image: String, $isbn: numeric, $object: [book_author_insert_input!]!) {
    delete_book_author(where: {book_id: {_eq: $id}}) {
      affected_rows
    }
    update_Books_by_pk(pk_columns: {id: $id}, _set: {name: $name, id: $id, type: $type, cover_image: $cover_image, isbn: $isbn, approved: null}) {
      id
    }
    insert_book_author(objects: $object){
      affected_rows
    }
  }
`