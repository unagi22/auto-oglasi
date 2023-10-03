import Api from "../../services/Api.js";
import AppModal from "../../components/app-modal.jsx";
import CarAdvertFormData from "./create-car-advert-data.jsx";
import CarFormData from "./create-car-form-data.jsx";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import styles from './admin.module.css';
import {DataGrid, GridActionsCellItem} from '@mui/x-data-grid';
import {carAdvertConfigColumns, carConfigColumns} from "./datagrid_config.js";
import {useEffect, useState} from "react";
import Box from '@mui/material/Box';
import AlertDialog from "../../components/alert-dialog.jsx";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {isEmpty} from "lodash";
import AppAlert from "../../components/app-alert.jsx";

const api = Api.getInstance();

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

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
    const [carAdvertModalOpen, setCarAdvertModalOpen] = useState(false);
    const [carModalOpen, setCarModalOpen] = useState(false);
    const [editCarAdvertModalOpen, setEditCarAdvertModalOpen] = useState(false);
    const [deleteCarAdvertModalOpen, setDeleteCarAdvertModalOpen] = useState(false);
    const [deleteCarModalOpen, setDeleteCarModalOpen] = useState(false);
    const [editCarModalOpen, setEditCarModalOpen] = useState(false);
    const [cars, setCars] = useState([]);
    const [carAdverts, setCarAdverts] = useState([]);
    const [carColumns, setCarColumns] = useState(carConfigColumns);
    const [carAdvertColumns, setCarAdvertColumns] = useState(carAdvertConfigColumns);
    const [editCarAdvertItem, setEditCarAdvertItem] = useState({});
    const [editCarItem, setEditCarItem] = useState(null);
    const [deleteCarAdvertItem, setDeleteCarAdvertItem] = useState({});
    const [deleteCarItem, setDeleteCarItem] = useState({});
    const [alerts, setAlerts] = useState([]);

    const carAdvertActions = (params) => {
        const isActive = params.row.is_active;
        const actions = [
            <GridActionsCellItem
                key="edit"
                icon={<EditIcon />}
                label="Edit"
                onClick={() => {
                    setEditCarAdvertItem(params.row);
                    openEditCarAdvertModal();
                }}
                showInMenu
            />,
            <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => {
                    setDeleteCarAdvertItem(params.row);
                    openDeleteCarAdvertModal();
                }}
                showInMenu
            />,
        ];
        if (api.isSuperuser) {
            actions.push(<GridActionsCellItem
                key="activate-deactivate"
                icon={isActive ? <CloseIcon /> : <CheckIcon />}
                label={isActive ? 'Deactivate' : 'Activate'}
                onClick={() => {
                    if (isActive) {
                        deactivateAdvert(params.row.id);
                    } else {
                        activateAdvert(params.row.id);
                    }
                }}
                showInMenu
            />)
        }

        return actions;
    }

    const carAdvertActionColumns = [{
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        getActions: (params) => {
            return carAdvertActions(params);
        },
    }]

    const carActions = (params) => {
        return [
            <GridActionsCellItem
                key="edit"
                icon={<EditIcon/>}
                label="Edit"
                onClick={async () => {
                    await fetchSingleCar(params.row.id)
                    openEditCarModal();
                }}
                showInMenu
            />,
            <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon/>}
                label="Delete"
                onClick={() => {
                    setDeleteCarItem(params.row);
                    openDeleteCarModal();
                }}
                showInMenu
            />,
        ];
    };

    const carActionColumns = [{
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        getActions: (params) => {
            return carActions(params);
        },
    }]

    const handleTabChange = (event, newValue) => (setTabValue(newValue));
    const openCarModal = () => (setCarModalOpen(true));
    const closeCarModal = () => (setCarModalOpen(false));
    const openCarAdvertsModal = () => (setCarAdvertModalOpen(true));
    const closeCarAdvertsModal = () => (setCarAdvertModalOpen(false));
    const openEditCarAdvertModal = () => (setEditCarAdvertModalOpen(true));
    const closeEditCarAdvertModal = () => (setEditCarAdvertModalOpen(false));

    const openDeleteCarAdvertModal = () => (setDeleteCarAdvertModalOpen(true));
    const closeDeleteCarAdvertModal = () => (setDeleteCarAdvertModalOpen(false));

    const openDeleteCarModal = () => (setDeleteCarModalOpen(true));
    const closeDeleteCarModal = () => (setDeleteCarModalOpen(false));
    const openEditCarModal = () => (setEditCarModalOpen(true));
    const closeEditCarModal = () => (setEditCarModalOpen(false));

    const getDeleteCarAdvertText = () => {
        if (isEmpty(deleteCarAdvertItem)) return '';

        const car = deleteCarAdvertItem.car;
        const carFormatted = `${car.model.manufacturer.name} ${car.model.name} (${car.vin})`;
        let text = `You are about to delete the car advert for the "${carFormatted}".\n`
        text += 'This action is permanent, are you sure you wish to continue?';

        return text;
    }

    const getDeleteCarText = () => {
        if (isEmpty(deleteCarItem)) return '';

        const car = deleteCarItem;
        const carFormatted = `${car.model.manufacturer.name} ${car.model.name} (${car.vin})`;
        let text = `You are about to delete this car: "${carFormatted}".\n`
        text += 'This action is permanent, are you sure you wish to continue?';

        return text;
    }

    const fetchSingleCar = (carId) => {
        api.get(`/cars/${carId}`)
            .then((data) => {
                setEditCarItem(data)
            })
            .catch((error) => (console.error("Error fetching the car:", error)))
    }

    const handleCreateCarAdvertSuccess = () => {
        closeCarAdvertsModal();
        fetchCarAdverts();
        setAlerts(['Car advert successfully created!', ...alerts]);
    }

    const handleCreateCarSuccess = () => {
        closeCarModal();
        fetchCars();
        setAlerts(['Car successfully created!', ...alerts]);
    }

    const handleEditCarAdvertSuccess = () => {
        closeEditCarAdvertModal();
        fetchCarAdverts();
        setAlerts(['Car advert successfully updated!', ...alerts]);
    }

    const handleEditCarSuccess = () => {
        closeEditCarModal();
        fetchCars();
        setAlerts(['Car successfully updated!', ...alerts]);
    }

    function fetchCars() {
        setCarsLoading(true);
        let url = `/cars/`;
        const pageNumber = carsPaginationModel.page + 1;
        if (pageNumber > 1) {
            url += `?page=${pageNumber}`;
        }
        api.get(url)
            .then((data) => {
                setCarsRowCount(data.count);
                setCars(data.results);
            })
            .catch((error) => (console.error("Error fetching cars:", error)))
            .finally(() => (setCarsLoading(false)));
    }

    function fetchCarAdverts() {
        setCarAdvertsLoading(true);
        let url = `/car-adverts/`;
        const pageNumber = carAdvertsPaginationModel.page + 1;
        if (pageNumber > 1) {
            url += `?page=${pageNumber}`;
        }
        api.get(url)
            .then((data) => {
                setCarAdvertsRowCount(data.count);
                setCarAdverts(data.results);
            })
            .catch((error) => (console.error("Error fetching car adverts:", error)))
            .finally(() => {
                setCarAdvertsLoading(false);
            });
    }

    function activateAdvert(carAdvertId) {
        api.post(`/car-adverts/${carAdvertId}/activate/`)
            .then(() => {
                fetchCarAdverts()
                setAlerts(['Car advert successfully activated', ...alerts])
            })
            .catch((error) => (console.error("Error activating car advert:", error)));
    }

    function deactivateAdvert(carAdvertId) {
        api.post(`/car-adverts/${carAdvertId}/deactivate/`)
            .then(() => {
                fetchCarAdverts()
                setAlerts(['Car advert successfully deactivated', ...alerts])
            })
            .catch((error) => (console.error("Error deactivating car advert:", error)));
    }

    function deleteCarAdvertConfirmed () {
        closeDeleteCarAdvertModal();
        deleteCarAdvert(deleteCarAdvertItem.id);
        setDeleteCarAdvertItem({});
    }

    function deleteCarConfirmed () {
        closeDeleteCarModal();
        deleteCar(deleteCarItem.id);
        setDeleteCarItem({});
    }

    function deleteCarAdvert(carAdvertId) {
        api.delete(`/car-adverts/${carAdvertId}/`)
            .then(() => {
                fetchCarAdverts();
                setAlerts(['Car advert successfully deleted', ...alerts]);
            })
            .catch((error) => (console.error("Error deleting car advert:", error)));
    }

    function deleteCar(carId) {
        api.delete(`/cars/${carId}/`)
            .then(() => {
                fetchCars();
                setAlerts(['Car successfully deleted', ...alerts]);
            })
            .catch((error) => (console.error("Error deleting car:", error)));
    }

    const [carsRowCount, setCarsRowCount] = useState(0);
    const [carAdvertsRowCount, setCarAdvertsRowCount] = useState(0);

    useEffect(() => {
        setCarAdvertColumns([...carAdvertColumns, ...carAdvertActionColumns])
        setCarColumns([...carColumns, ...carActionColumns])
        fetchCarAdverts();
        fetchCars();
    }, []);

    useEffect(() => {
        if (alerts.length > 0 ) {
            setTimeout(() => {
                const alertsCopy = [...alerts];
                alertsCopy.shift();
                setAlerts(alertsCopy);
            }, 4000)
        }
    }, [alerts]);

    const [carsRowCountState, setCarsRowCountState] = useState(carsRowCount);
    const [carAdvertsRowCountState, setCarAdvertsRowCountState] = useState(carsRowCount);
    const [carAdvertsPaginationModel, setCarAdvertsPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });
    const [carsPaginationModel, setCarsPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });

    const [carsLoading, setCarsLoading] = useState(false);
    const [carAdvertsLoading, setCarAdvertsLoading] = useState(false);

    useEffect(() => {
        setCarsRowCountState((prevRowCountState) =>
            carsRowCountState !== undefined ? carsRowCountState : prevRowCountState,
        );
    }, [carsRowCountState, setCarsRowCountState]);

    useEffect(() => {
        setCarAdvertsRowCountState((prevRowCountState) =>
            carAdvertsRowCountState !== undefined ? carAdvertsRowCountState : prevRowCountState,
        );
    }, [carAdvertsRowCountState, setCarAdvertsRowCountState]);

    useEffect(() => {
        fetchCarAdverts();
    }, [carAdvertsPaginationModel]);

    useEffect(() => {
        fetchCars();
    }, [carsPaginationModel]);

    return (
        <div style={{ width: '90%', margin: '2rem auto', position: 'relative' }}>
            {alerts.length > 0 && <AppAlert message={alerts[0]} />}
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
                <header className={styles.header}>
                    <AppModal
                        buttonText="Create car advert"
                        title="Create car advert"
                        open={carAdvertModalOpen}
                        handleOpen={openCarAdvertsModal}
                        handleClose={closeCarAdvertsModal}
                        contents={<CarAdvertFormData successCallable={handleCreateCarAdvertSuccess} />}
                    />
                </header>
                <div className={styles.pageContainer}>
                    <DataGrid
                        loading={carAdvertsLoading}
                        rows={carAdverts}
                        columns={carAdvertColumns}
                        paginationModel={carAdvertsPaginationModel}
                        onPaginationModelChange={setCarAdvertsPaginationModel}
                        paginationMode="server"
                        pageSizeOptions={[2, 5]}
                        rowCount={carAdvertsRowCount}
                    />
                </div>
                <AlertDialog
                    title="Delete car advert?"
                    text={getDeleteCarAdvertText()}
                    icon={<DeleteForeverIcon />}
                    open={deleteCarAdvertModalOpen}
                    handleOpen={openDeleteCarAdvertModal}
                    handleClose={closeDeleteCarAdvertModal}
                    handleConfirm={deleteCarAdvertConfirmed}
                />
                <AppModal
                    buttonHidden
                    buttonText="Edit car advert"
                    title="Edit car advert"
                    open={editCarAdvertModalOpen}
                    handleOpen={openEditCarAdvertModal}
                    handleClose={closeEditCarAdvertModal}
                    contents={<CarAdvertFormData editItem={editCarAdvertItem} successCallable={handleEditCarAdvertSuccess} />}
                />
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>
                <header className={styles.header}>
                    <AppModal
                        buttonText="Create car"
                        title="Create car"
                        open={carModalOpen}
                        handleOpen={openCarModal}
                        handleClose={closeCarModal}
                        contents={<CarFormData successCallable={handleCreateCarSuccess} />}
                    />
                </header>
                <div className={styles.pageContainer}>
                    <DataGrid
                        loading={carsLoading}
                        rows={cars}
                        columns={carColumns}
                        paginationModel={carsPaginationModel}
                        onPaginationModelChange={setCarsPaginationModel}
                        paginationMode="server"
                        pageSizeOptions={[2, 5]}
                        rowCount={carsRowCount}
                    />
                </div>
            </CustomTabPanel>

            <AlertDialog
                title="Delete car?"
                text={getDeleteCarText()}
                icon={<DeleteForeverIcon />}
                open={deleteCarModalOpen}
                handleOpen={openDeleteCarModal}
                handleClose={closeDeleteCarModal}
                handleConfirm={deleteCarConfirmed}
            />
            <AppModal
                buttonHidden
                buttonText="Edit car"
                title="Edit car"
                open={editCarModalOpen}
                handleOpen={openEditCarModal}
                handleClose={closeEditCarModal}
                contents={<CarFormData editItem={editCarItem} successCallable={handleEditCarSuccess} />}
            />
        </div>
    );
};

export default Admin;
