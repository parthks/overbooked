import styles from '../styles/Home.module.css'
import adminClient from '../lib/graphql/admin'
import { useQuery } from '@apollo/client';

import {QUERY_ALL_BOOKS} from '../lib/graphql/books'

import BookTile from '../components/BookTile'

import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { Input } from 'antd';

const { Search } = Input;



export default function Home({}) {

  const inputRef = React.useRef(null)

  const [searchQuery, setSearchQuery] = useState('%%')

  const { loading, error, data } = useQuery(QUERY_ALL_BOOKS, {
    variables: { search: searchQuery },
  });


  const books = loading ? [] : data.Books
  // const [loading, setLoading] = useState(false)
  console.log(books)


  const onSearch = (value) => {
    console.log({value})
    // alert(value)
    setSearchQuery(`%${value}%`)

    inputRef.current?.blur()

    // inputRef.current!.focus({
    //   cursor: 'end',
    // });
    // setLoading(false)
  }
  
  return (<>
    <Container maxWidth="sm">
      <Box my={4}>
        <Search 
        ref={inputRef}
        onSearch={onSearch} 
        allowClear 
        placeholder="Search for a book for title or author" enterButton="Search" size="large" loading={loading} onPressEnter={(e) => onSearch(e.target.value)} />
      </Box>
    </Container>


  <div className={styles.grid}>
  {loading ? '' : books.map(bookData => <BookTile key={bookData.id} data={bookData} />)}
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
  

  // const {data} = await adminClient.query({
  //   query: QUERY_ALL_BOOKS
  // });

  // console.log(data)


  return {
    props: {
      books: []
    },
  }
}