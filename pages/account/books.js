import {useState} from 'react'

import {QUERY_BOOK_BY_UID, UPDATE_BOOK} from '../../lib/graphql/books'
import { useQuery, useMutation } from '@apollo/client';

import {useAuthUserState, customUploadFile, deleteFileFromStorage} from '../../lib/firebase'
import MaterialTable from 'material-table'
import tableIcons from '../../lib/tableIcons'

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import SignInScreen from '../../components/signInPopup'
import BookDetail from '../../components/BookDetail';
import { Button } from '@material-ui/core';
import {  message } from 'antd';
import LinearProgress from '@material-ui/core/LinearProgress';
import { v4 as uuidv4 } from 'uuid';


export default function MyBooks() {
    const authUser = useAuthUserState()

    const { loading, error, data, refetch } = useQuery(QUERY_BOOK_BY_UID, {
        variables: { uid: authUser?.uid },
    });
    const [updateBookData] = useMutation(UPDATE_BOOK);

    const [bookDetail, setBookDetail] = useState(null)
    const [loadingPercent, setLoadingPercent] = useState(0)
    const [uploadLoading, setUploadLoading] = useState(false)

    console.log(loading, error, data)

    const bookData = data ? data.Books.map(d => ({...d, 
        author_ids: d.book_authors.map(d => d.Author.id),
        authors: d.book_authors.map(d => d.Author.name).join(", ")})) : []


    const submitData = async () => {
        
        // if (!bookDetail.imageFile) {message.error("Image is required"); return}
        if (!bookDetail.name) {message.error("Book's name is required"); return}
        if (!bookDetail.author_ids || !bookDetail.author_ids.length) {message.error("Authors are required"); return}
        if (!bookDetail.type) {message.error("Book's type is required"); return}

        const uid = authUser?.uid

        if (!uid) {
            message.error("Not logged in!")
            return
        }

        setUploadLoading(true)
    
        
        console.log(bookDetail)

        // NO New Image File Uploaded
        if (!bookDetail.imageFile) {
            await updateBookData({variables: {
                name: bookDetail.name,
                id: bookDetail.id,
                type: bookDetail.type,
                object: bookDetail.author_ids.map(authorID => ({
                    "author_id": authorID,
                    "book_id": bookDetail.id
                }))
            }})    
            refetch()
            window.scrollTo(0,0)
            message.success("Successfully Updated Book!")
            setLoadingPercent(0)
            setUploadLoading(false)
            setBookDetail(null)
            return
        }

        const newImageID = uuidv4()

        const bookID = bookDetail.id

        deleteFileFromStorage("books/"+bookID+"/"+bookDetail.cover_image).catch(e => message.error("Failed to delete old image"))

        customUploadFile({
            fileName: newImageID,
            location: "books/"+bookID,
            file: bookDetail.imageFile,
            onError: () => {
                message.error("Image upload failed")
                setLoadingPercent(0)
                setUploadLoading(false)
            },
            onProgress: ({percent}) => setLoadingPercent(percent),
            onSuccess: async () => {
            await updateBookData({variables: {
                name: bookDetail.name,
                id: bookDetail.id,
                cover_image: newImageID,
                type: bookDetail.type,
                object: bookDetail.author_ids.map(authorID => ({
                    "author_id": authorID,
                    "book_id": bookDetail.id
                }))
            }})    
            refetch()
            window.scrollTo(0,0)
            message.success("Successfully Updated Book!")
            setLoadingPercent(0)
            setUploadLoading(false)
            setBookDetail(null)
            }           
            
        });
      }


    return <> <Container maxWidth="md">
    <SignInScreen />

    <Box alignItems="center" display="flex" my={4}>
        {bookDetail ? <Button onClick={() => setBookDetail(null)} style={{marginRight: '20px'}}>Back</Button> : ''}
        <Typography>{bookDetail ? "Edit Book Details" : "Manage My Books"}</Typography>
    </Box>


    {bookDetail ? <>

    <BookDetail setData={setBookDetail} data={bookDetail} /> 

    {uploadLoading ? 
    <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value={loadingPercent} />
        </Box>
        <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
            loadingPercent,
        )}%`}</Typography>
        </Box>
    </Box> : 

        <Button onClick={async () => {
            await submitData()
        }} variant="contained" color="primary">Submit</Button>
    }

    </>
    :
    <MaterialTable
        icons={tableIcons}
        isLoading={loading || data === undefined || !!error}
          columns={[
            { title: 'ID', field: 'id', defaultSort: 'asc' },
            { title: 'Name', field: 'name' },
            { title: 'Type', field: 'type' },
            { title: 'Authors', field: 'authors' },
          ]}
          data={bookData}
          title=""
          onRowClick={(e, rowData) => setBookDetail(rowData)}
        /> 
    }

    </Container>
    </>
}