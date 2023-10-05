import {useCallback, useEffect, useState} from "react";
import Api from "../services/Api.js";
import AdvertCard from "./AdvertCard.jsx";
import Box from "@mui/material/Box";
import {FormGroup, InputLabel, MenuItem, Select, FormControl, TextField} from "@mui/material";
import {isEmpty, debounce} from "lodash";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { yellow } from '@mui/material/colors';
import AppModal from "../components/app-modal.jsx";
import Button from "@mui/material/Button";
import ShowCarAdvert from "./admin/car-adverts/show.jsx";


const api = Api.getInstance();

const Home = () => {
    const [adverts, setAdverts] = useState([]);
    const [bodyTypes, setBodyTypes] = useState([]);
    const [colors, setColors] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [gearboxes, setGearboxes] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [bodyType, setBodyType] = useState(0);
    const [color, setColor] = useState(0);
    const [fuelType, setFuelType] = useState(0);
    const [gearbox, setGearbox] = useState(0);
    const [manufacturer, setManufacturer] = useState(0);
    const [model, setModel] = useState(0);
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [mileageFrom, setMileageFrom] = useState('');
    const [mileageTo, setMileageTo] = useState('');
    const [cubicCapacityFrom, setCubicCapacityFrom] = useState('');
    const [cubicCapacityTo, setCubicCapacityTo] = useState('');
    const [debouncedFilters, setDebouncedFilters] = useState({});
    const [showAdvert, setShowAdvert] = useState(false);
    const [selectedCarAdvert, setSelectedCarAdvert] = useState({id: null})
    const [itemsCount, setItemsCount] = useState(0)
    const [nextPage, setNextPage] = useState(null)

    useEffect(() => {
        fetchCarAdvertsDebounced();
        fetchFiltersData();
    }, []);

    useEffect(() => {
        if (!bodyType && !color && !fuelType && !gearbox && !manufacturer && !model && !priceFrom && !priceTo && !mileageFrom && !mileageTo &&
            !cubicCapacityFrom && !cubicCapacityTo) {
        }
    }, [bodyType, color, fuelType, gearbox, manufacturer, model, priceFrom, priceTo, mileageFrom, mileageTo,
        cubicCapacityFrom, cubicCapacityTo]);

    useEffect(() => {
        if (manufacturer > 0) {
            api.get(`/manufacturers/${manufacturer}/models`)
                .then((data) => (setModels(data)))
                .catch((error) => (console.error("Error fetching car body types:", error)));
        } else {
            setModel(0);
            fetchCarAdvertsDebounced();
        }
    }, [manufacturer]);

    function updateFilterObject(object, key, gteValue, lteValue) {
        if (gteValue || lteValue) {
            object[key] = {};
            if (gteValue) {
                object[key]['gte'] = parseInt(gteValue);
            }
            if (lteValue) {
                object[key]['lte'] = parseInt(lteValue);
            }
        }
    }

    function ensureCarObjectExists(filters) {
        if (!filters['car']) {
            filters['car'] = {};
        }
    }

    function choose(attr, localAttr) {
        return attr > 0 ? attr : (localAttr > 0 ? localAttr : null);
    }

    function getFiltersDebounced(debouncedFilters = null) {
        const filters = {};
        let source = debouncedFilters || {};

        let localBodyType;
        let localColor;
        let localFuelType;
        let localGearbox;
        let localModel;
        let localManufacturer;

        if (!isEmpty(source)) {
            const {
                priceFrom: localPriceFrom,
                priceTo: localPriceTo,
                mileageFrom: localMileageFrom,
                mileageTo: localMileageTo,
                cubicCapacityFrom: localCubicCapacityFrom,
                cubicCapacityTo: localCubicCapacityTo,
            } = debouncedFilters;

            localBodyType = debouncedFilters.bodyType;
            localColor = debouncedFilters.color;
            localFuelType = debouncedFilters.fuelType;
            localGearbox = debouncedFilters.gearbox;
            localManufacturer = debouncedFilters.manufacturer;
            localModel = debouncedFilters.model;

            updateFilterObject(filters, 'price', localPriceFrom, localPriceTo);
            ensureCarObjectExists(filters);
            updateFilterObject(filters['car'], 'mileage', localMileageFrom, localMileageTo);
            updateFilterObject(filters['car'], 'cubic_capacity', localCubicCapacityFrom, localCubicCapacityTo);
        } else {
            updateFilterObject(filters, 'price', priceFrom, priceTo);
            ensureCarObjectExists(filters);
            updateFilterObject(filters['car'], 'mileage', mileageFrom, mileageTo);
            updateFilterObject(filters['car'], 'cubic_capacity', cubicCapacityFrom, cubicCapacityTo);
        }

        const chosenBodyType = choose(bodyType, localBodyType);
        const chosenColor = choose(color, localColor);
        const chosenFuelType = choose(fuelType, localFuelType);
        const chosenGearbox = choose(gearbox, localGearbox);
        const chosenManufacturer = choose(manufacturer, localManufacturer);
        const chosenModel = choose(model, localModel);

        if (chosenBodyType || chosenColor || chosenFuelType || chosenGearbox || chosenManufacturer || chosenModel) {
            ensureCarObjectExists(filters);
        }
        if (chosenModel || chosenManufacturer) {
            filters['car']['model'] = {};
        }

        if (chosenBodyType) {
            filters['car']['body_type'] = { id: chosenBodyType };
        }
        if (chosenColor) {
            filters['car']['color'] = { id: chosenColor };
        }
        if (chosenFuelType) {
            filters['car']['fuel_type'] = { id: chosenFuelType };
        }
        if (chosenGearbox) {
            filters['car']['gearbox'] = { id: chosenGearbox };
        }
        if (chosenManufacturer) {
            filters['car']['model']['manufacturer'] = { id: chosenManufacturer };
        }
        if (chosenModel) {
            filters['car']['model']['id'] = chosenModel;
        }

        return filters;
    }

    function filtersToQueryParams(filters) {
        return `filters=${encodeURIComponent(JSON.stringify(filters))}`;
    }

    function generateUrlValue () {
        let url = "/car-adverts/all";
        const filters = getFiltersDebounced(debouncedFilters);
        if (!isEmpty(filters)) {
            url += `?${filtersToQueryParams(filters)}`;
        }
        if (nextPage) {
            url += `&page=${nextPage}`
        }

        return url;
    }

    function fetchCarAdvertsDebounced(debouncedFilters = null) {
        let url = "/car-adverts/all";
        const filters = getFiltersDebounced(debouncedFilters);
        if (!isEmpty(filters)) {
            url += `?${filtersToQueryParams(filters)}`;
        }
        if (nextPage) {
            url += `&page=${nextPage}`
        }

        api
            .get(url)
            .then((data) => {
                setAdverts([...adverts, ...data.results]);

                setItemsCount(data.count)
                if (data.next) {
                    const nextPage = data.next.split('page=')[1];
                    setNextPage(nextPage);
                } else {
                    setNextPage(null);
                }
            })
            .catch((error) => console.error("Error fetching car adverts:", error));
    }

    const sendRequest = useCallback((value) => {
        fetchCarAdvertsDebounced(value);
    }, []);

    const debouncedSendRequest = (delay) => {
        return debounce(sendRequest, delay);
    };

    function createHandleChange(setterFunction, key, delayTime = 1500) {
        return (event) => {
            const value = event.target.value;
            setterFunction(value);
            const debouncedFiltersModified = { ...debouncedFilters, [key]: value };
            setDebouncedFilters(debouncedFiltersModified);
            debouncedSendRequest(delayTime)(debouncedFiltersModified);
        };
    }

    const handleShowAdvertModal = (advert) => {
        setSelectedCarAdvert(advert);
        openShowAdvertModal();
    };
    const openShowAdvertModal = () => (setShowAdvert(true));
    const closeShowAdvertModal = () => (setShowAdvert(false));

    const handleBodyTypeChange = createHandleChange(setBodyType, 'bodyType', 10);
    const handleColorChange = createHandleChange(setColor, 'color', 10);
    const handleFuelTypeChange = createHandleChange(setFuelType, 'fuelType', 10);
    const handleGearboxChange = createHandleChange(setGearbox, 'gearbox', 10);
    const handleManufacturerChange = createHandleChange(setManufacturer, 'manufacturer', 10);
    const handleModelChange = createHandleChange(setModel, 'model', 10);
    const handlePriceFromChange = createHandleChange(setPriceFrom, 'priceFrom');
    const handlePriceToChange = createHandleChange(setPriceTo, 'priceTo');
    const handleMileageFromChange = createHandleChange(setMileageFrom, 'mileageFrom');
    const handleMileageToChange = createHandleChange(setMileageTo, 'mileageTo');
    const handleCubicCapacityFromChange = createHandleChange(setCubicCapacityFrom, 'cubicCapacityFrom');
    const handleCubicCapacityToChange = createHandleChange(setCubicCapacityTo, 'cubicCapacityTo');

    function loadMoreItems() {
        fetchCarAdvertsDebounced();
    }

    const fetchFiltersData = () => {
        api.get('/car-body-types/')
            .then((data) => (setBodyTypes(data)))
            .catch((error) => (console.error("Error fetching car body types:", error)));
        api.get('/car-colors/')
            .then((data) => (setColors(data)))
            .catch((error) => (console.error("Error fetching car colors:", error)));
        api.get('/car-fuel-types/')
            .then((data) => (setFuelTypes(data)))
            .catch((error) => (console.error("Error fetching fuel types:", error)));
        api.get('/car-gearboxes/')
            .then((data) => (setGearboxes(data)))
            .catch((error) => (console.error("Error fetching gearboxes:", error)));
        api.get('/car-manufacturers/')
            .then((data) => (setManufacturers(data)))
            .catch((error) => (console.error("Error fetching manufacturers:", error)));
    }

    return (
        <Box>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ bgcolor: yellow[50] }}
                >
                    <Typography variant="h5">Filters</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: yellow[50] }}>
                    <Box sx={{
                        m: 2, display: 'flex', flexWrap: 'wrap', p: '0 12px', border: '1px solid rgba(0,0,0,0.2)',
                        borderRadius: '4px', flex: '1 0 20%'
                    }}>
                        <FormGroup sx={{ mr: 2, my: 1, minWidth: '15%' }}>
                            <FormControl>
                                <InputLabel id="body-type-label">
                                    Body type
                                </InputLabel>
                                <Select
                                    labelId="body-type-label"
                                    id="body-type"
                                    value={bodyType}
                                    label="Body type"
                                    size="small"
                                    onChange={handleBodyTypeChange}
                                >

                                    <MenuItem value={0}>
                                        <Box sx={{ color: 'text.secondary' }}>Select body type</Box>
                                    </MenuItem>
                                    {bodyTypes.map(type => (<MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>))}
                                </Select>
                            </FormControl>
                        </FormGroup>
                        <FormGroup sx={{ mr: 2, my: 1, minWidth: '15%' }}>
                            <FormControl>
                                <InputLabel id="color-label">
                                    Color
                                </InputLabel>
                                <Select
                                    labelId="color-label"
                                    id="color"
                                    value={color}
                                    label="Color"
                                    size="small"
                                    onChange={handleColorChange}
                                >
                                    <MenuItem value={0}>
                                        <Box sx={{ color: 'text.secondary' }}>Select color</Box>
                                    </MenuItem>
                                    {colors.map(color => (
                                        <MenuItem key={color.id} value={color.id}>
                                            {color.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </FormGroup>
                        <FormControl sx={{ mr: 2, my: 1, minWidth: '15%' }}>
                            <InputLabel id="fuel-type-label">
                                Fuel type
                            </InputLabel>
                            <Select
                                labelId="fuel-type-label"
                                id="fuel-type"
                                value={fuelType}
                                label="Fuel type"
                                size="small"
                                onChange={handleFuelTypeChange}
                            >
                                <MenuItem value={0}>
                                    <Box sx={{ color: 'text.secondary' }}>Select fuel type</Box>
                                </MenuItem>
                                {fuelTypes.map(fuelType => (<MenuItem key={fuelType.id} value={fuelType.id}>
                                    {fuelType.name}
                                </MenuItem>))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ mr: 2, my: 1, minWidth: '20%' }}>
                            <InputLabel id="gearbox-label">
                                Gearbox
                            </InputLabel>
                            <Select
                                id="gearbox"
                                labelId="gearbox-label"
                                label="Gearbox"
                                size="small"
                                value={gearbox}
                                onChange={handleGearboxChange}
                            >
                                <MenuItem value={0}>
                                    <Box sx={{ color: 'text.secondary' }}>Select gearbox</Box>
                                </MenuItem>
                                {gearboxes.map(gearbox => (
                                    <MenuItem key={gearbox.id} value={gearbox.id}>
                                        {gearbox.description} ({gearbox.code})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ mr: 2, my: 1, minWidth: '15%' }}>
                            <InputLabel id="manufacturer-label">Manufacturer</InputLabel>
                            <Select
                                labelId="manufacturer-label"
                                id="manufacturer"
                                value={manufacturer}
                                label="Manufacturer"
                                size="small"
                                onChange={handleManufacturerChange}
                            >
                                <MenuItem value={0}>
                                    <Box sx={{ color: 'text.secondary' }}>Select manufacturer</Box>
                                </MenuItem>
                                {manufacturers.map(manufacturer => (
                                    <MenuItem key={manufacturer.id} value={manufacturer.id}>{manufacturer.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ mr: 2, my: 1, minWidth: '15%' }}>
                            <InputLabel id="model-label">Model</InputLabel>
                            <Select
                                labelId="model-label"
                                id="model"
                                label="Model"
                                size="small"
                                value={model}
                                onChange={handleModelChange}
                            >
                                <MenuItem value={0}>
                                    <Box sx={{ color: 'text.secondary' }}>
                                        {manufacturer ? 'Select model' : 'Select manufacturer first'}
                                    </Box>
                                </MenuItem>
                                {models.map(model => (
                                    <MenuItem key={model.id} value={model.id}>
                                        {model.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ mr: 2, my: 1, minWidth: '10%' }}>
                            <TextField
                                id="price-from"
                                label="Price from"
                                type="number"
                                size="small"
                                value={priceFrom}
                                onChange={handlePriceFromChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{ mr: 2, my: 1, minWidth: '10%' }}>
                            <TextField
                                id="price-to"
                                label="Price to"
                                type="number"
                                size="small"
                                value={priceTo}
                                onChange={handlePriceToChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{ mr: 2, my: 1, minWidth: '10%' }}>
                            <TextField
                                id="mileage-from"
                                label="Mileage from"
                                type="number"
                                size="small"
                                value={mileageFrom}
                                onChange={handleMileageFromChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{ mr: 2, my: 1, minWidth: '10%' }}>
                            <TextField
                                id="mileage-to"
                                label="Mileage to"
                                type="number"
                                size="small"
                                value={mileageTo}
                                onChange={handleMileageToChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{ mr: 2, my: 1, minWidth: '10%' }}>
                            <TextField
                                id="cubic-capacity-from"
                                label="Cubic capacity from"
                                type="number"
                                size="small"
                                value={cubicCapacityFrom}
                                onChange={handleCubicCapacityFromChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{ mr: 2, my: 1, minWidth: '10%' }}>
                            <TextField
                                id="cubic-capacity-to"
                                label="Cubic capacity to"
                                type="number"
                                size="small"
                                value={cubicCapacityTo}
                                onChange={handleCubicCapacityToChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <div className="card-container">
                {adverts.map((advert) => (
                    <Box sx={{ outline: 'none', cursor: 'pointer' }} key={advert.id} onClick={() => handleShowAdvertModal(advert)}>
                        <AdvertCard advert={advert} />
                    </Box>
                ))}
            </div>
            {nextPage && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="outlined" onClick={loadMoreItems}>Load more</Button>
            </Box>}
            <Box>
                <AppModal
                    key={selectedCarAdvert.id}
                    buttonHidden
                    title={selectedCarAdvert.title}
                    contents={<ShowCarAdvert advert={selectedCarAdvert} />}
                    handleOpen={openShowAdvertModal}
                    handleClose={closeShowAdvertModal}
                    open={showAdvert}
                />
            </Box>
        </Box>
    );
};

export default Home;
