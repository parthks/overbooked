import { useRouter } from 'next/router'
import {useState} from 'react'

import { useQuery, useMutation } from '@apollo/client';
import {QUERY_USER_BOOK_INTEREST, SHOW_INTEREST_IN_BOOK} from '../../lib/graphql/interests'


import BookDetail from '../../components/BookDetail'
import adminClient from '../../lib/graphql/admin'
import {QUERY_BOOK_BY_PK} from '../../lib/graphql/books'

import Container from '@material-ui/core/Container'

import Image from 'next/image'
import MatLink from '@material-ui/core/Link';

import Link from 'next/link'
import {useAuthUserState} from '../../lib/firebase'
import SignInScreen from '../../components/signInPopup'


import { Grid, Typography, Button, CircularProgress } from '@material-ui/core'
import { message } from 'antd';


export default function BookDetailPage({data}) {
    const router = useRouter()

    const [loginVisible, setLoginVisible] = useState(false)
    const authUser = useAuthUserState()
    const [loadingInterestButton, setLoadingInterestButton] = useState(false)

    const { loading: queryLoading, error, data: userInterestData, refetch } = useQuery(QUERY_USER_BOOK_INTEREST, {
      variables: { user_id: authUser?.uid, book_id: data?.id },
    });

    const [showInterestInBook, {loading: mutationLoading}] = useMutation(SHOW_INTEREST_IN_BOOK, {variables: {
      user_id: authUser?.uid, book_id: data?.id
    }, 
    onCompleted: () => {message.success("Interest sent"); refetch().then(() => setLoadingInterestButton(false)); }, 
    onError: (err) => {message.error(err.message); setLoadingInterestButton(false)}
    })

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    console.log(userInterestData)

    const interestedInBook = () => {
      if (!authUser) { setLoginVisible(true); return }
      setLoadingInterestButton(true)
      showInterestInBook()
    }
    

    // const backButtonLink = <Link href="/"><MatLink component="button" variant="body2">See more books</MatLink></Link>

    let backButtonLink = <Link href="/"><MatLink variant="body2">See more books</MatLink></Link>

    if (typeof window !== "undefined") {
        console.log('localStorage.getItem("book-click")', localStorage.getItem("book-click"))
        if (localStorage.getItem("book-click") === "true") {
            backButtonLink = <MatLink 
            onClick={() => {localStorage.setItem("book-click", "false"); window.history.back();}} component="button" variant="body2">See more books</MatLink>
        }
    }
    
    return <>
    <Container style={{paddingTop: '16px'}} maxWidth="sm">

    <SignInScreen onClose={() => setLoginVisible(false)} visible={loginVisible} />

    <Grid container justify="space-between" alignItems="center">
    <Grid item>{backButtonLink}</Grid>
    <Grid item>
      {loadingInterestButton ? <CircularProgress /> : 
      <Button disabled={userInterestData?.interests.length} onClick={interestedInBook} variant="contained" color="secondary">
        {userInterestData?.interests.length ? "Interest Sent" : "Interested"}</Button>}
      </Grid>
    </Grid>
    
    
    <br />

    <Typography gutterBottom variant="h4" component="h1">{data.name}</Typography>

    <img src={"https://overbooked.imgix.net/books/"+data.id+"/"+data.cover_image+"?w=600"} alt="avatar" style={{ width: '100%' }} /> 
    {/* <Image
        src={"/books/"+data.id+""}
        alt="Cover of Book"
        width={600}
        height={500}
        objectFit="contain"
        layout="intrinsic"
      /> */}

    <br /><br />


    <Typography variant="h6" color="textSecondary" component="h2">
        By {data.book_authors.map(d => d?.Author?.name).join(", ")}
    </Typography>

    <br />

    <Typography variant="h6" color="textSecondary" component="h3">
    {data.type}
    </Typography>

    </Container>
    </>
}


// This function gets called at build time
export async function getStaticPaths() {
    return {
      // Only `/posts/1` and `/posts/2` are generated at build time
      //paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
      // Enable statically generating additional pages
      // For example: `/posts/3`
      paths: [],
      fallback: true,
    }
  }


// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. 
export async function getStaticProps(context) {
    const urlName = context.params["id"]

    const checkID = urlName.split("-").slice(-1)

    if (!checkID.length) {
        return {
            notFound: true,
          }
    }

    const book_id = checkID[0]

    const {data} = await adminClient.query({
        query: QUERY_BOOK_BY_PK,
        variables: {id: book_id}
      });

    if (!data.Books_by_pk) {
        return {
            notFound: true,
          }
    }

    const bookName = data.Books_by_pk.name
    const actualURLName = `${bookName.toLowerCase().split(" ").join("-")}-${book_id}`

    if (actualURLName !== urlName) {
        return {
            redirect: {
              destination: '/book/'+actualURLName,
              permanent: true,
            },
          }
    }

    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        revalidate: 60,
        props: {
            data: data.Books_by_pk,
        },
    }
}