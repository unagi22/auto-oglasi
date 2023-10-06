import {Card, CardContent} from "@mui/joy";
import Typography from "@mui/joy/Typography";

function ShowItemCard ({title, description}) {
    return (
        <Card variant="outlined" sx={{ width:{xs: '100%', sm: '25%'}, p: 1, height: "100%"}}>
            <CardContent>
                <Typography level="title-md">{title}</Typography>
                <Typography>{description}</Typography>
            </CardContent>
        </Card>
    );
}

export default  ShowItemCard;
