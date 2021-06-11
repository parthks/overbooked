import styles from '../styles/Home.module.css'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

import BookTile from '../components/BookTile'

import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { Input } from 'antd';

const { Search } = Input;



export default function Home({books}) {
  const [loading, setLoading] = useState(false)
  // console.log(books)


  const onSearch = (value) => {
    console.log({value})
    alert(value)
    setLoading(false)
  }
  
  return (<>
    <Container maxWidth="sm">
      <Box my={4}>
        <Search onSearch={onSearch} allowClear placeholder="Search for a book" enterButton="Search" size="large" loading={loading} onPressEnter={(e) => onSearch(e.target.value)} />
      </Box>
    </Container>


  <div className={styles.grid}>
    {books.map(bookData => <BookTile key={bookData.id} data={bookData} />)}
  </div>

   
</>
  );
  
}

 // build tiles - full width!!! grid layout...
  // click tile to see Book detail on URL of book's name

  // upload image to firebase
  // connect to imgix
  // use Next/Image to display

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'http://165.232.180.39/v1/graphql',
    cache: new InMemoryCache(),
    headers: {
      'x-hasura-admin-secret': "QrV2KvcXXpO0NrEVx45dW9Pag0L2"
    }
  });

  const {data} = await client.query({
    query: gql`
    query MyQuery {
      Books {
        name
        Author {
          name
        }
        id
      }
    }
    `
  });

  // console.log(data)


  return {
    props: {
      books: data.Books
    }
  }
}