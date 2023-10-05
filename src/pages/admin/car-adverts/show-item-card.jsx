import {Card, CardContent} from "@mui/joy";
import Typography from "@mui/joy/Typography";

function ShowItemCard ({title, description}) {
    return (
        <Card variant="outlined" sx={{ width: '25%' }}>
            <CardContent>
                <Typography level="title-md">{title}</Typography>
                <Typography>{description}</Typography>
            </CardContent>
        </Card>
    );
}

export default  ShowItemCard;
