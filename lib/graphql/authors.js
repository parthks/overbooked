import { gql } from '@apollo/client';

export const GET_AUTHOR_BY_PK = gql`
query MyQuery($id: Int!) {
    Authors_by_pk(id: $id) {
      id
      name
    }
  }  
`

export const GET_AUTHORS = gql`
query MyQuery($name: String!) {
    Authors(where: {name: {_ilike: $name}}, limit: 5 ){
      id
      name
    }
  }   
`

export const INSERT_AUTHOR = gql`
mutation ($name: String!) {
  insert_Authors_one(object: {name: $name}, on_conflict: {constraint: Authors_name_key, update_columns: name}) {
    id
    name
  }
} 
`