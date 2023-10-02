import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import {useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/joy/Button";

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

export default function ChipsArray({chipsList, setSelectedFeatureIds}) {
    const [chipData, setChipData] = useState(chipsList);

    const updateSelectedIds = (chipData) => {
        setSelectedFeatureIds(chipData.filter(item => item.selected).map(item => item.id))
    }

    const handleSelectDeselectAll = (selectValue) => {
        const chipDataModified = [...chipData].map(item => {
            item.selected = selectValue
            return item;
        })
        setChipData(chipDataModified);
    }

    const handleClick = (chipToSelect) => () => {
        const chipDataModified = [...chipData]
        chipDataModified[chipToSelect.key].selected = true;
        setChipData(chipDataModified);
        updateSelectedIds(chipDataModified);
    }

    const handleDelete = (chipToDelete) => () => {
        const chipDataModified = [...chipData]
        chipDataModified[chipToDelete.key].selected = false;
        setChipData(chipDataModified);
        updateSelectedIds(chipDataModified);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" sx={{mb: 1}}>
                <Button variant="outlined" sx={{mr: 1}} onClick={() => handleSelectDeselectAll(true)}>
                    Select all
                </Button>
                <Button variant="outlined" onClick={() => handleSelectDeselectAll(false)}>
                    Deselect all
                </Button>
            </Box>
            <Paper
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                }}
                component="ul"
            >
                {chipData.map((data) => {
                    return (
                        <ListItem key={data.key}>
                            {data.selected ?
                                <Chip
                                    label={data.label}
                                    color="primary"
                                    variant="outlined"
                                    onDelete={handleDelete(data)}
                                /> :
                                <Chip
                                    label={data.label}
                                    variant="outlined"
                                    onClick={handleClick(data)}
                                />
                            }
                        </ListItem>
                    );
                })}
            </Paper>
        </Box>
    );
}
