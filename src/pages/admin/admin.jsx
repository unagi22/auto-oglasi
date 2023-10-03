import Api from "../../services/Api.js";
import PropTypes from 'prop-types';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import {useState} from "react";
import Box from '@mui/material/Box';
import CarAdverts from "./car-adverts/index/Index.jsx";
import Cars from "./cars/index/Index.jsx";

const api = Api.getInstance();

function CustomTabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Admin = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => (setTabValue(newValue));

    return (
        <div style={{ width: '90%', margin: '2rem auto', position: 'relative' }}>
            <Typography variant="h3" gutterBottom align="center">
                {api.isSuperuser ? 'Admin panel' : 'User data'}
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="Car adverts" {...a11yProps(0)} />
                    <Tab label="Cars" {...a11yProps(1)} />
                </Tabs>
            </Box>

            <CustomTabPanel value={tabValue} index={0}>
                <CarAdverts />
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>
                <Cars />
            </CustomTabPanel>
        </div>
    );
};

export default Admin;
