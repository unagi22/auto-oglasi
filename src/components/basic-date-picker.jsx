import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";

export default function BasicDatePicker({changeHandler, clearHandler, title = 'Date picker', helperText = ''}) {
    const [errorPresent, setErrorPresent] = useState(false)
    useEffect(() => {
        console.log('helperText', helperText)
        setErrorPresent(!!helperText)
    }, [helperText]);


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="body2" gutterBottom sx={{mt: 1, color: 'error'}}>
                {title}
            </Typography>
            <DatePicker
                slotProps={{
                    textField: { size: 'small', fullWidth: true, helperText: helperText },
                    field: { clearable: true, onClear: () => clearHandler() },
                    sx: { }
                }}
                format="DD/MM/YYYY"
                onChange={(newValue) => changeHandler(newValue)}
                sx={{
                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: errorPresent ? 'error.main' : 'rgba(0, 0, 0, 0.23)' }, // error.main
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: errorPresent ? 'error.main' : 'rgba(0, 0, 0, 0.87)' },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: errorPresent ? 'error.main' : 'primary.main' },
                    '& .MuiFormHelperText-root': { color: errorPresent ? 'error.main' : 'rgba(0, 0, 0, 0.23)' },
                    '& .MuiSvgIcon-root': { color: errorPresent ? 'error.main' : 'rgba(0, 0, 0, 0.54)' },
                }}
            />
        </LocalizationProvider>
    );
}
