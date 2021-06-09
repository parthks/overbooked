
import { gql } from '@apollo/client';


export const QUERY_USER = gql`
query MyQuery($uid: String!) {
    Users_by_pk(uid: $uid) {
      new_user
      email
      phone_number
      name
      location_query
      location
      notification_phone
      notification_email
    }
  }
`

export const INSERT_USER = gql`
mutation InsertUser($uid: String!, $email: String = null, $phone_number: String = null, $name: String = null, $pincode: Int = null) {
    insert_Users_one(object: {uid: $uid, email: $email, name: $name, phone_number: $phone_number}, on_conflict: {constraint: Users_pkey, update_columns: [] }) {
      uid
    }
  }   
`

export const UPDATE_USER = gql`
mutation UpdateUser($uid: String!, $data: Users_set_input = {}) {
  update_Users_by_pk(pk_columns: {uid: $uid}, _set: $data) {
    uid
  }
}  
`
