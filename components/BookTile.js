import {useEffect, useRef} from 'react'

import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import Image from 'next/image'
import Link from 'next/link'


export default function BookTile({data}) {
    const headerRef = useRef(null)

    useEffect(() => {
      console.log('headerRef', headerRef)
      console
    })

    return <Link href={`/book/${data.name.toLowerCase().split(" ").join("-")}-${data.id}`}>
      <Card onClick={() => {
        console.log("CARD CLICK", data)
        localStorage.setItem("book-click", "true")
    }}>
        <CardActionArea style={{height: '100%', display: 'contents'}}>
        <CardHeader className={"book-tile-content"} ref={headerRef} style={{fontSize: '1.2rem', height: '107px'}} title={data.name} />
        {/* <Typography gutterBottom variant="h5" component="h2">
            {data.name}
          </Typography>
        </CardHeader> */}
        <CardMedia
          component="img"
          alt={data.name}
          style={{height: 181, objectFit: 'contain'}}
          image={"https://overbooked.imgix.net/books/"+data.id+"/"+data.cover_image+"?h=200"}
          title={data.name}
        />
        <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
            Genre: {data.type}
          </Typography>
          
          <Typography variant="body2" color="textSecondary" component="p">
          
            By {data.book_authors.map(d => d?.Author?.name).join(", ")}
          </Typography>          
        </CardContent>
      </CardActionArea>
        
    </Card></Link>
}