import { useRouter } from 'next/router'
import BookDetail from '../../components/BookDetail'
import adminClient from '../../lib/graphql/admin'
import {QUERY_BOOK_BY_PK} from '../../lib/graphql/books'

import Container from '@material-ui/core/Container'

import Image from 'next/image'
import Link from 'next/link'

import { Typography } from '@material-ui/core'


export default function BookDetailPage({data}) {
    const router = useRouter()
    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    console.log(data)

    return <>
    <Container style={{paddingTop: '16px'}} maxWidth="sm">
    <Link href="/"><a>See more books</a></Link><br /><br />

    <img src={"https://overbooked.imgix.net/books/"+data.id+"/cover?w=600"} alt="avatar" style={{ width: '100%' }} /> 
    {/* <Image
        src={"/books/"+data.id+"/cover"}
        alt="Cover of Book"
        width={600}
        height={500}
        objectFit="contain"
        layout="intrinsic"
      /> */}

    <br /><br />
    <Typography gutterBottom variant="h4" component="h1">{data.name}</Typography>
    

    <Typography variant="h6" color="textSecondary" component="h2">
        By {data.book_authors.map(d => d?.Author?.name).join(", ")}
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
        props: {
            data: data.Books_by_pk,
        },
    }
}