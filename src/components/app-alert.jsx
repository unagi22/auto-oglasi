import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";

export default function AppAlert({type, message}) {
    return (
        <Alert severity={type} sx={{ position: 'absolute', top: 0, right: 0 }}>
            <AlertTitle>Success</AlertTitle>
            {message}
        </Alert>
    )
}
