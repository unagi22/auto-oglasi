import Api from "../../../../services/Api.js";
import styles from "../../admin.module.css";
import AppModal from "../../../../components/app-modal.jsx";
import CreateEdit from "../create-edit/CreateEdit.jsx";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import AlertDialog from "../../../../components/alert-dialog.jsx";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever.js";
import {useEffect, useState} from "react";
import {dataGridColumnsConfig, multiTenancyColumns} from "./config.js";
import EditIcon from "@mui/icons-material/Edit.js";
import DeleteIcon from "@mui/icons-material/Delete.js";
import {isEmpty} from "lodash";
import Box from "@mui/material/Box";
import AppAlert from "../../../../components/app-alert.jsx";
import Typography from "@mui/material/Typography";

const api = Api.getInstance();

const CarAdverts = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [columns, setColumns] = useState(dataGridColumnsConfig);
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState({});
    const [alerts, setAlerts] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [rowCountState, setRowCountState] = useState(rowCount);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });

    const actions = (params) => {
        return [
            <GridActionsCellItem
                key="edit"
                icon={<EditIcon />}
                label="Edit"
                onClick={async () => {
                    await fetchSingleItem(params.row.id)
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
    };

    const actionColumns = [{
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 80,
        getActions: (params) => {
            return actions(params);
        },
    }]

    const openModal = () => (setModalOpen(true));
    const closeModal = () => (setModalOpen(false));
    const openDeleteModal = () => (setDeleteModalOpen(true));
    const closeDeleteModal = () => (setDeleteModalOpen(false));
    const openEditModal = () => (setEditModalOpen(true));
    const closeEditModal = () => (setEditModalOpen(false));

    const getDeleteText = () => {
        if (isEmpty(deleteItem)) return '';

        const car = deleteItem;
        const carFormatted = `${car.model.manufacturer.name} ${car.model.name} (${car.vin})`;
        let text = `You are about to delete this car: "${carFormatted}".\n`
        text += 'This action is permanent, are you sure you wish to continue?';

        return text;
    }

    const fetchSingleItem = (id) => {
        api.get(`/cars/${id}`)
            .then((data) => (setEditItem(data)))
            .catch((error) => (console.error("Error fetching the car:", error)))
    }

    const handleCreateSuccess = () => {
        closeModal();
        fetchList();
        setAlerts(['Car successfully created!', ...alerts]);
    }

    const handleEditSuccess = () => {
        closeEditModal();
        fetchList();
        setAlerts(['Car successfully updated!', ...alerts]);
    }

    function fetchList() {
        setItemsLoading(true);
        let url = `/cars/`;
        const pageNumber = paginationModel.page + 1;
        if (pageNumber > 1) {
            url += `?page=${pageNumber}`;
        }
        api.get(url)
            .then((data) => {
                setRowCount(data.count);
                setItems(data.results);
            })
            .catch((error) => (console.error("Error fetching cars:", error)))
            .finally(() => (setItemsLoading(false)));
    }

    function deleteConfirmed () {
        closeDeleteModal();
        itemDelete(deleteItem.id);
        setDeleteItem({});
    }

    function itemDelete(id) {
        api.delete(`/cars/${id}/`)
            .then(() => {
                fetchList();
                setAlerts(['Car successfully deleted!', ...alerts]);
            })
            .catch((error) => (console.error("Error deleting car:", error)));
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
        fetchList();
    }, [paginationModel]);

    useEffect(() => {
        if (api.isSuperuser) {
            setColumns([...columns, ...multiTenancyColumns, ...actionColumns])
        } else {
            setColumns([...columns, ...actionColumns])
        }
        fetchList();
    }, []);

    return (
        <Box>
            {alerts.length > 0 && <AppAlert message={alerts[0]} />}
            <header className={styles.header}>
                <AppModal
                    buttonText="Create car"
                    title="Create car"
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
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        paginationMode="server"
                        pageSizeOptions={[2, 5]}
                        rowCount={rowCount}
                    />}
            </div>
            <AlertDialog
                title="Delete car?"
                text={getDeleteText()}
                icon={<DeleteForeverIcon />}
                open={deleteModalOpen}
                handleOpen={openDeleteModal}
                handleClose={closeDeleteModal}
                handleConfirm={deleteConfirmed}
            />
            <AppModal
                buttonHidden
                title="Edit car"
                open={editModalOpen}
                handleOpen={openEditModal}
                handleClose={closeEditModal}
                contents={<CreateEdit editItem={editItem} successCallable={handleEditSuccess} />}
            />
        </Box>
    );
};

export default  CarAdverts;
