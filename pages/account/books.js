import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import {calculate_distance} from '../../lib/helpers'

import {QUERY_BOOK_BY_UID, UPDATE_BOOK} from '../../lib/graphql/books'
import {ACCEPT_INTEREST, REJECT_INTEREST} from '../../lib/graphql/interests'
import { useQuery, useMutation, } from '@apollo/client';
import {client} from '../../lib/graphql/client'

import {useAuthUserState, customUploadFile, deleteFileFromStorage} from '../../lib/firebase'
import MaterialTable from 'material-table'
import tableIcons from '../../lib/tableIcons'

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Alert } from 'antd';
import PendingStatus from '@material-ui/icons/HourglassEmpty';
import ApprovedStatus from '@material-ui/icons/CheckCircleOutline';
import RejectedStatus from '@material-ui/icons/Cancel';
import RefreshIcon from '@material-ui/icons/Refresh';


import SignInScreen from '../../components/signInPopup'
import BookDetail from '../../components/BookDetail';
import { Button } from '@material-ui/core';
import {  message } from 'antd';
import LinearProgress from '@material-ui/core/LinearProgress';
import { v4 as uuidv4 } from 'uuid';
import BookTile from '../../components/BookTile';


export default function MyBooks() {
    const authUser = useAuthUserState()

    const userLocationCoords = useSelector(state => state.user?.userData?.location?.coordinates)

    const { loading, error, data, refetch } = useQuery(QUERY_BOOK_BY_UID, {
        variables: { uid: authUser?.uid },
        onError: (err) => {
            if (err.message === 'expecting a value for non-nullable variable: "uid"') {return}
            message.error(err.message)
        }
    });
    const [updateBookData] = useMutation(UPDATE_BOOK);

    const [tableLoading, setTableLoading] = useState(false)

    const [bookDetail, setBookDetail] = useState(null)
    const [loadingPercent, setLoadingPercent] = useState(0)
    const [uploadLoading, setUploadLoading] = useState(false)

    console.log(loading, error, data, userLocationCoords)

    const bookData = data ? data.Books.map(d => ({...d, 
        interests: d.interests.map(d => ({ id: d.id, approved: d.approved, rand: new Date().getTime(), ...d.User }) ),
        author_ids: d.book_authors.map(d => d.Author.id),
        authors: d.book_authors.map(d => d.Author.name).join(", ")})) : []

    useEffect(() => {
        refetch()
    }, [authUser])

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
                isbn: bookDetail.isbn ? bookDetail.isbn : null,
                name: bookDetail.name,
                id: bookDetail.id,
                cover_image: bookDetail.cover_image,
                type: bookDetail.type,
                object: bookDetail.author_ids.map(authorID => ({
                    "author_id": authorID,
                    "book_id": bookDetail.id
                }))
            }})    
            await refetch()
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
                isbn: bookDetail.isbn ? bookDetail.isbn : null,
                name: bookDetail.name,
                id: bookDetail.id,
                cover_image: newImageID,
                type: bookDetail.type,
                object: bookDetail.author_ids.map(authorID => ({
                    "author_id": authorID,
                    "book_id": bookDetail.id
                }))
            }})    
            await refetch()
            window.scrollTo(0,0)
            message.success("Successfully Updated Book!")
            setLoadingPercent(0)
            setUploadLoading(false)
            setBookDetail(null)
            }           
            
        });
      }

    
    let contactInterestedUser = <Typography>No User details found :( please contact support</Typography>
    if (bookDetail && bookDetail.taken) {
        const userDetails = bookDetail.interests.find((d) => d.approved)
        if (userDetails) {
            contactInterestedUser = <>
                <Typography>Name: {userDetails.name}</Typography>
                {userDetails.notification_email ? <Typography>Email: {userDetails.email}</Typography> : ''}
                {userDetails.notification_phone ? <Typography>Phone: {userDetails.phone_number}</Typography> : ''}
                {userDetails.location?.length !== 2 || userLocationCoords?.length !== 2 ? "" : 
                <Typography>Location: {`~${calculate_distance(userDetails.location[0], userLocationCoords[0], userDetails.location[1], userLocationCoords[1]).toFixed(1)}km away`}</Typography>
                }
                    
            </>
        }
    }

    return <> <Container maxWidth="md">
    <SignInScreen />

    <Box alignItems="center" display="flex" my={4}>
        {bookDetail ? <Button onClick={() => setBookDetail(null)} style={{marginRight: '20px'}}>Back</Button> : ''}
        <Typography>{bookDetail ? "Book Details" : "Manage My Books"}</Typography>
    </Box>


    {bookDetail ? <>

        {bookDetail.taken ? <><Alert showIcon 
        description="Contact the user for delivery and payment"
        message="Give your book away" type="success" />
        {contactInterestedUser}
        <br /><br />
        <div style={{maxWidth: '400px'}}>
        <BookTile data={bookDetail} />
        </div>
        </> : 

        bookDetail.approved ? 
        <>
        <Alert message="Give your book away" type="success" />
        <MaterialTable
            icons={tableIcons}
            columns={[
                { title: 'Name', field: 'name' },
                { title: 'Location', field: 'location', render: (rowData) => rowData.location?.length !== 2 || userLocationCoords?.length !== 2 ? "-" : 
                    `~${calculate_distance(rowData.location[0], userLocationCoords[0], rowData.location[1], userLocationCoords[1]).toFixed(1)}km away` },
                
                { title: 'Contact', field: 'contact', render: (rowData) => <>
                    {rowData.notification_email ? <><span><span style={{fontWeight: 'bold'}}>Email: </span>{rowData.email}</span><br /></> : ''}
                    {rowData.notification_phone ? <span><span style={{fontWeight: 'bold'}}>Phone: </span>{rowData.phone_number}</span> : ''} </>
                },
            ]}
            data={bookDetail.interests.map(d => ({...d, location: d.location?.coordinates}) )}
            title=""
            localization={{body: {emptyDataSourceMessage: "No Interests received"}}}
            options={{toolbar: false, search: false, actionsColumnIndex: -1,
                rowStyle: (rowData) => {
                    if (rowData.approved !== null && !rowData.approved) {
                        return {background: `red`}
                    }
                    return {}
                }
            }}
            actions={[
                rowData => ({ 
                    icon: () => rowData.approved !== null ? "-" : <Button style={{background: 'green', color: 'white'}} variant="filled" color="secondary">Give Book</Button>,
                    tooltip: 'Give Book Away',
                    onClick: async (event, rowData) => {
                        // alert("You accepted " + rowData.name); console.log(rowData)
                        await client.mutate({mutation: ACCEPT_INTEREST, variables: {book_id: bookDetail.id, id: rowData.id}  })
                        await refetch()
                        setBookDetail({...bookDetail, taken: true, interests: bookDetail.interests.map(d => {
                            if (d.id === rowData.id) {return {...d, approved: true}}
                            {return {...d, approved: false}}
                        }) })
                        message.success("Accepted Interest")
                    },
                    disabled: rowData.approved !== null
                }),
                rowData => ({ 
                    icon: () => rowData.approved !== null ? "-" : <Button style={{background: 'red', color: 'white'}} variant="filled" color="secondary">Reject</Button>,
                    tooltip: 'Reject Interest Request',
                    onClick: async (event, rowData) => {
                        // alert("You rejected " + rowData.name); console.log(rowData)
                        await client.mutate({mutation: REJECT_INTEREST, variables: {id: rowData.id}  })
                        await refetch()
                        setBookDetail({...bookDetail, interests: bookDetail.interests.map(d => {
                            if (d.id === rowData.id) {return {...d, approved: false}}
                            return d
                        }) })
                        message.success("Rejected Interest")
                    },
                    disabled: rowData.approved !== null
                }),
            ]}
            /> 
        <br /><br />
        <div style={{maxWidth: '400px'}}>
        <BookTile data={bookDetail} />
        </div>
        </> : 
        <>

        {bookDetail.approved === null ? 
        <Alert message="Book Details under review"
        description="We are currently reviewing the book details, check back shortly"
        type="warning"
        showIcon
        /> : !bookDetail.approved ? <Alert message="Please submit again"
        description={bookDetail.message}
        type="error"
        showIcon
        /> : ''}

        <BookDetail readOnly={bookDetail.approved || bookDetail.approved === null} setData={bookDetail.approved || bookDetail.approved === null ? (dadada) => {} : setBookDetail} data={bookDetail} /> 

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

            <Button disabled={bookDetail.approved || bookDetail.approved === null} onClick={async () => {
                await submitData()
            }} variant="contained" color="primary">Submit</Button>
        }
        </>
        }

    </>

    
    :
    <MaterialTable
    actions={[
        {
          icon: () => <RefreshIcon />,
          tooltip: 'Refresh',
          isFreeAction: true,
          onClick: (event) => {
            //   console.log('refresh', refetch)
              setTableLoading(true)
              refetch().then(d => {
                    setTimeout(() => {
                        setTableLoading(false)  
                    }, 1000);
                })
            }   
            
        }
      ]}
        icons={tableIcons}
        isLoading={loading || data === undefined || !!error || tableLoading}
          columns={[
            { title: 'ID', field: 'id', defaultSort: 'asc', hidden: true },
            { title: 'Status', field: 'approved', render: (rowData) => 
                rowData.approved === null ? <PendingStatus /> : 
                rowData.approved ? <ApprovedStatus /> : <RejectedStatus />
            },
            { title: 'Name', field: 'name' },
            { title: 'Authors', field: 'authors' },
            { title: 'Genre', field: 'type' },
          ]}
          data={bookData}
          title=""
          onRowClick={(e, rowData) => setBookDetail(rowData)}
          options={{rowStyle: (rowData) => {
              if (rowData.taken) {
                  return {background: 'green'}
              }
          }}}
        /> 
    }

    </Container>
    </>
}