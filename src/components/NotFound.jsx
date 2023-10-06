import React from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const NotFound = () => {
    return (
        <Box sx={{ height: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h2">404 Not Found</Typography>
            <Typography variant="body1">The page you are looking for doesn't exist.</Typography>
        </Box>
    );
};

export default NotFound;
