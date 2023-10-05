import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function AdvertCard({advert}) {
    return (
        <Card sx={{ width: 345, height: 350, mr: 1, mt: 1, userSelect: 'none' }}>
            <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image={advert.image}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {advert.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {advert.description}
                </Typography>
            </CardContent>
        </Card>
    );
}
