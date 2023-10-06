import { useState } from "react";
import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import Api from "../services/Api.js";
import { grey } from '@mui/material/colors';
import Typography from "@mui/material/Typography";

const api = Api.getInstance();

const Login = () => {
    const [message, setMessage] = useState("Hello, your email is being verified.");
    const {token} = useParams();

    useEffect(() => {
        verifyEmail(token);
    }, []);

    async function verifyEmail(token) {
        let response = await fetch(api.getUrl(`/verify-email/${token}`), {
            headers: {'Content-Type': 'application/json'},
        });

        if (response.status === 200) {
            setMessage('Your email is successfully verified, you will be redirected to the login page.')
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000)
        }
    }


    return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" sx={{ color: grey[600] }}>{message}</Typography>
        </Box>
    );
};

export default Login;
