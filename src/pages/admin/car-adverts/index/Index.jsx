import styles from "../../admin.module.css";
import AppModal from "../../../../components/app-modal.jsx";
import CreateEdit from "../create-edit/CreateEdit.jsx";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import AlertDialog from "../../../../components/alert-dialog.jsx";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever.js";
import Box from "@mui/material/Box";
import {isEmpty} from "lodash";
import {useEffect, useState} from "react";
import Api from "../../../../services/Api.js";
import {dataGridColumnsConfig, multiTenancyColumns} from "./config.js";
import EditIcon from "@mui/icons-material/Edit.js";
import DeleteIcon from "@mui/icons-material/Delete.js";
import CloseIcon from "@mui/icons-material/Close.js";
import CheckIcon from "@mui/icons-material/Check.js";
import AppAlert from "../../../../components/app-alert.jsx";
import Typography from "@mui/material/Typography";

const api = Api.getInstance();

const CarAdverts = () => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState({});
    const [itemsLoading, setItemsLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [columns, setColumns] = useState(dataGridColumnsConfig);
    const [itemsPaginationModel, setItemsPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });
    const [rowCount, setRowCount] = useState(0);
    const [rowCountState, setRowCountState] = useState(rowCount);
    const [alerts, setAlerts] = useState([]);

    const actions = (params) => {
        const isActive = params.row.is_active;
        const actions = [
            <GridActionsCellItem
                key="edit"
                icon={<EditIcon />}
                label="Edit"
                onClick={() => {
                    setEditItem(params.row);
                    openEditModal();
                }}
                showInMenu
            />,
            <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => {
                    setDeleteItem(params.row);
                    openDeleteModal();
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

    const actionColumns = [{
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        getActions: (params) => {
            return actions(params);
        },
    }]

    const openModal = () => (setModalOpen(true));
    const openDeleteModal = () => (setDeleteModalOpen(true));
    const closeDeleteModal = () => (setDeleteModalOpen(false));
    const closeModal = () => (setModalOpen(false));
    const openEditModal = () => (setEditModalOpen(true));
    const closeEditModal = () => (setEditModalOpen(false));

    const handleCreateSuccess = () => {
        closeModal();
        fetchList();
        setAlerts(['Car advert successfully created!', ...alerts]);
    }

    const getDeleteText = () => {
        if (isEmpty(deleteItem)) return '';

        const car = deleteItem.car;
        const carFormatted = `${car.model.manufacturer.name} ${car.model.name} (${car.vin})`;
        let text = `You are about to delete the car advert for the "${carFormatted}".\n`
        text += 'This action is permanent, are you sure you wish to continue?';

        return text;
    }

    function itemDelete(id) {
        api.delete(`/car-adverts/${id}/`)
            .then(() => {
                fetchList();
                setAlerts(['Car advert successfully deleted', ...alerts]);
            })
            .catch((error) => (console.error("Error deleting car advert:", error)));
    }

    function deleteConfirmed () {
        closeDeleteModal();
        itemDelete(deleteItem.id);
        setDeleteItem({});
    }

    const handleEditSuccess = () => {
        closeEditModal();
        fetchList();
        setAlerts(['Car advert successfully updated!', ...alerts]);
    }

    function activateAdvert(id) {
        api.post(`/car-adverts/${id}/activate/`)
            .then(() => {
                fetchList()
                setAlerts(['Car advert successfully activated', ...alerts])
            })
            .catch((error) => (console.error("Error activating car advert:", error)));
    }

    function deactivateAdvert(id) {
        api.post(`/car-adverts/${id}/deactivate/`)
            .then(() => {
                fetchList()
                setAlerts(['Car advert successfully deactivated', ...alerts])
            })
            .catch((error) => (console.error("Error deactivating car advert:", error)));
    }

    function fetchList() {
        setItemsLoading(true);
        let url = `/car-adverts/`;
        const pageNumber = itemsPaginationModel.page + 1;
        if (pageNumber > 1) {
            url += `?page=${pageNumber}`;
        }
        api.get(url)
            .then((data) => {
                setRowCount(data.count);
                setItems(data.results);
            })
            .catch((error) => (console.error("Error fetching car adverts:", error)))
            .finally(() => {
                setItemsLoading(false);
            });
    }

    useEffect(() => {
        setRowCountState((prevRowCountState) =>
            rowCountState !== undefined ? rowCountState : prevRowCountState,
        );
    }, [rowCountState, setRowCountState]);

    useEffect(() => {
        if (alerts.length > 0 ) {
            setTimeout(() => {
                const alertsCopy = [...alerts];
                alertsCopy.shift();
                setAlerts(alertsCopy);
            }, 4000)
        }
    }, [alerts]);

    useEffect(() => {
        if (api.isSuperuser) {
            setColumns([...columns, ...multiTenancyColumns, ...actionColumns])
        } else {
            setColumns([...columns, ...actionColumns])
        }
        fetchList();
    }, []);

    useEffect(() => {
        fetchList();
    }, [itemsPaginationModel]);

    return (
        <Box>
            {alerts.length > 0 && <AppAlert message={alerts[0]} />}
            <header className={styles.header}>
                <AppModal
                    buttonText="Create car advert"
                    title="Create car advert"
                    open={modalOpen}
                    handleOpen={openModal}
                    handleClose={closeModal}
                    contents={<CreateEdit successCallable={handleCreateSuccess} />}
                />
            </header>
            <div className={styles.pageContainer}>
                {items.length === 0 ?
                    <Typography variant="h5">No items</Typography>
                : <DataGrid
                    loading={itemsLoading}
                    rows={items}
                    columns={columns}
                    paginationModel={itemsPaginationModel}
                    onPaginationModelChange={setItemsPaginationModel}
                    paginationMode="server"
                    pageSizeOptions={[2, 5]}
                    rowCount={rowCount}
                />}
            </div>
            <AlertDialog
                title="Delete car advert?"
                text={getDeleteText()}
                icon={<DeleteForeverIcon />}
                open={deleteModalOpen}
                handleOpen={openDeleteModal}
                handleClose={closeDeleteModal}
                handleConfirm={deleteConfirmed}
            />
            <AppModal
                buttonHidden
                title="Edit car advert"
                open={editModalOpen}
                handleOpen={openEditModal}
                handleClose={closeEditModal}
                contents={<CreateEdit editItem={editItem} successCallable={handleEditSuccess} />}
            />
        </Box>
    );
};

export default CarAdverts;
