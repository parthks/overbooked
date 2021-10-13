import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

import adminClient from '../lib/graphql/admin'
import { useQuery } from '@apollo/client';

import {QUERY_ALL_BOOKS} from '../lib/graphql/books'

import BookTile from '../components/BookTile'

import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';


import { Input } from 'antd';

const { Search } = Input;



export default function SearchBooks({}) {
  const router = useRouter()

  const inputRef = React.useRef(null)

  // const [searchQuery, setSearchQuery] = useState(`%${router.query.q ? router.query.q : ''}%`)

  const { loading, error, data } = useQuery(QUERY_ALL_BOOKS, {
    variables: { search: `%${router.query.q ? router.query.q.toLowerCase() : ''}%` },
  });


  const books = loading ? [] : data.Books
  // const [loading, setLoading] = useState(false)
  console.log(books)
  console.log(router.query)



  const onSearch = (value) => {
    console.log({value})
    // alert(value)
    // setSearchQuery(`%${value}%`)

    inputRef.current?.blur()

    // setSearchQuery(`%${value}%`)
    if (!value) {
      router.push("/search")
    } else {
      router.push("/search?q="+value)
    }

    // inputRef.current!.focus({
    //   cursor: 'end',
    // });
    // setLoading(false)
  }
  
  return (<>
    <Container maxWidth="sm">
      <Box my={2}>
      <Typography>Have some extra books you want to donate?&nbsp;&nbsp;
      <NextLink href="/add"><Link href="/add">
        Add Books Now
      </Link></NextLink>
      </Typography>
      </Box>
      <Box my={2}>
        <Search 
        defaultValue={router.query.q ? router.query.q : ''}
        ref={inputRef}
        onSearch={onSearch} 
        allowClear 
        placeholder="Search by title or author" 
        enterButton="Search" size="large" loading={loading} onPressEnter={(e) => onSearch(e.target.value)} />
      </Box>
    </Container>


  <div className={styles.grid}>
  {loading ? 'Loading...' : books.map(bookData => <BookTile key={bookData.id} data={bookData} />)}
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