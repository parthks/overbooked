import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import Image from 'next/image'
import Link from 'next/link'


export default function BookTile({data}) {
    return <Card>
        <CardActionArea>
        <CardMedia
          component="img"
          alt={data.name}
          style={{height: 200}}
          image={"https://overbooked.imgix.net/books/"+data.id+"/cover?h=200"}
          title={data.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {data.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            By {data.Author.name}
          </Typography>
        </CardContent>
      </CardActionArea>
        
    </Card>
}