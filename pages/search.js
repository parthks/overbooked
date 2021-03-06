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


import { Input, Checkbox } from 'antd';

const { Search } = Input;



export default function SearchBooks({}) {
  const router = useRouter()

  const inputRef = React.useRef(null)
  const [fiction, setFiction] = useState(router?.query?.type === "fiction")
  const [nonFiction, setNonFiction] = useState(router?.query?.type === "non-fiction")

  // const [searchQuery, setSearchQuery] = useState(`%${router.query.q ? router.query.q : ''}%`)

  const { loading, error, data } = useQuery(QUERY_ALL_BOOKS, {
    variables: { 
      search: `%${router.query.q ? router.query.q.toLowerCase() : ''}%`,
      type: `${router.query.type ? router.query.type.toLowerCase() : ''}%` 
    },
  });


  const books = loading ? [] : (data ? data.Books : "ERROR")
  // const [loading, setLoading] = useState(false)
  console.log(books)
  console.log(router.query)



  const onSearch = (value) => {
    console.log({value})

    inputRef.current?.blur()
    let type = null
    if (fiction && nonFiction) {
      type = null
    } else if (fiction) {
      type = "type=fiction"
    } else if (nonFiction) {
      type = "type=non-fiction"
    } else {
      type = null
    }

    let query = `/search?`
    if (value) query += ("q="+value+"&") 
    if (type) query += type+"&" 
    router.push(query)

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
        <Checkbox checked={fiction} onChange={(e) => {
          const checked = e.target.checked
          setFiction(checked)
        }}>fiction</Checkbox>
         <Checkbox checked={nonFiction} onChange={(e) => {
          const checked = e.target.checked
          setNonFiction(checked)
        }}>non-fiction</Checkbox>
      </Box>
    </Container>


  <div className={styles.grid}>
  {loading ? 'Loading...' : (books === "ERROR" ? "Error please try again" : books.map(bookData => <BookTile key={bookData.id} data={bookData} />) )}
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