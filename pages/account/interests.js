import {useEffect, useState} from 'react'

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import SignInScreen from '../../components/signInPopup'

import {useAuthUserState} from '../../lib/firebase'
import MaterialTable from 'material-table'
import tableIcons from '../../lib/tableIcons'
import RefreshIcon from '@material-ui/icons/Refresh';

import { useQuery, useMutation, serializeFetchParameter } from '@apollo/client';
import {QUERY_USER_ALL_INTEREST_BOOKS} from '../../lib/graphql/interests'
import { message } from 'antd';


export default function MyInterests() {
    const authUser = useAuthUserState()

    const { loading, error, data, refetch } = useQuery(QUERY_USER_ALL_INTEREST_BOOKS, {
        variables: { user_id: authUser?.uid },
        onCompleted: (data) => {
            console.log("QUERY COMPLETE", data)
        },
        onError: (err) => {
            if (err.message === 'expecting a value for non-nullable variable: "uid"') {return}
            message.error(err.message)
        }
    });

    useEffect(() => {
        refetch()
    }, [authUser])

    const [interestDetail, setInterestDetail] = useState(null)
    const [tableLoading, setTableLoading] = useState(false)

    console.log(data, loading, error, refetch)

    const bookData = data ? data.interests.map(d => ({...d, 
        book_name: d.Book.name,
        author_ids: d.Book.book_authors.map(d => d.Author.id),
        authors: d.Book.book_authors.map(d => d.Author.name).join(", ")})) : []

    return <> <Container maxWidth="sm">
    <SignInScreen />

    <Box my={4}>
        <Typography>Interested Books</Typography>
    </Box>

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
            {title: 'Status', field: 'approved', render: (rowData) => 
                rowData.approved === null ? "Pending" : 
                rowData.approved ? "Accepted" : "Rejected" 
            },
            { title: 'Book Name', field: 'book_name' },
            { title: 'Authors', field: 'authors' },
            { title: 'Date', field: 'created_at', type: 'date' },
          ]}
          data={bookData}
          title=""
        //   onRowClick={(e, rowData) => setInterestDetail(rowData)}
        /> 

    </Container>
    </>
}