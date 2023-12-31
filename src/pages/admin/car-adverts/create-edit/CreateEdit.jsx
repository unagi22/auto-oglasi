import {Button, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import ImageUploader from "../../../../components/ImageUploader.jsx";
import {isNil} from "lodash";
import {useEffect, useState} from "react";
import Api from "../../../../services/Api.js";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FormHelperText from '@mui/material/FormHelperText';
import {tabColumnsObj} from "./config.js";
import Typography from "@mui/joy/Typography";
import {Checkbox} from "@mui/joy";

const api = Api.getInstance();

const CarAdvertFormData = ({editItem = null, successCallable}) => {
    const [currencies, setCurrencies] = useState([]);
    const [cars, setCars] = useState([]);
    const [currency, setCurrency] = useState(0);
    const [car, setCar] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [images, setImages] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [freeCarsChecked, setFreeCarsChecked] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [existingImages, setExistingImages] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [tenant, setTenant] = useState(0);

    const handleTitleChange = (event) => (setTitle(event.target.value));
    const handleDescriptionChange = (event) => (setDescription(event.target.value));
    const handlePriceChange = (event) => (setPrice(event.target.value));
    const handleCurrencyChange = (event) => (setCurrency(event.target.value));
    const handleCarChange = (event) => (setCar(event.target.value));
    const handleTenantChange = (event) => (setTenant(event.target.value));

    const getValidationErrorText = (key) => (validationErrors[key] && validationErrors[key][0] || '');

    const editMode = () => (!!editItem);

    const getFormData = () => {
        const payload = {
            currency_id: currency,
            car_id: car,
            title,
            description,
            price
        };

        if (api.isSuperuser) {
            payload.created_by_id = tenant
        }

        const formData = new FormData();

        for (const key in payload) {
            if (!isNil(payload[key]) && payload[key] !== 0) {
                formData.append(key, payload[key]);
            }
        }

        if (images[0]) {
            formData.append('image', images[0]);
        }
        if (editMode() && existingImages.length === 0) {
            formData.append('image', null);
        }

        console.log('formData', formData)

        return formData;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (editMode()) {
            api.patch(`/car-adverts/${editItem.id}/`, getFormData())
                .then(async (response) => {
                    const responseData = await response.json();
                    if (response.status === 200) {
                        successCallable()
                        console.log("Car advert data successfully updated", response.data);
                    } else if (response.status === 400) {
                        setValidationErrors(responseData)
                        console.error("Error adding car data:", responseData);
                    }
                })
                .catch(error => {
                    console.log('error data', error)
                });
        } else {
            api.post('/car-adverts/', getFormData())
                .then(async (response) => {
                    const responseData = await response.json();
                    if (response.status === 201) {
                        successCallable()
                        console.log("Car advert data successfully added");
                    } else if (response.status === 400) {
                        setValidationErrors(responseData)
                        console.error("Error adding car data:", responseData);
                    }
                })
                .catch(error => {
                    console.log('error data', error)
                });
        }
    }

    const handleUpdateExistingImages = (newImages) => {
        setExistingImages(newImages);
    };

    const handleSetImages = (images) => {
        if (images.length > 0) {
            setExistingImages([]);
            setImages(images);
        } else {
            setImages([]);
        }
    };

    function setEditItemValues() {
        setTitle(editItem.title);
        setDescription(editItem.description);
        setPrice(editItem.price);
        setCurrency(editItem.currency.id);
        setCar(editItem.car.id);
        setExistingImages([{id: editItem.id, image: editItem.image}]);
        if (api.isSuperuser) {
            setTenant(editItem.created_by.id)
        }
    }

    useEffect(() => {
        if (editMode()) {
            setEditItemValues()
        }
        fetchRelatingData()
    }, []);

    useEffect(() => {
        fetchCars()
    }, [freeCarsChecked]);

    const fetchCars = () => {
        let url = '/cars/?all_data=true';
        if (freeCarsChecked) {
            url += '&free_cars=true';
            if (editMode()) {
                url += `&include_ids=${editItem.car.id}`
            }
        }

        api.get(url)
            .then((data) => {
                setCars(data)
            })
            .catch((error) => (console.error("Error fetching cars:", error)));
    }

    const fetchRelatingData = () => {
        api.get('/currencies/')
            .then((data) => (setCurrencies(data)))
            .catch((error) => (console.error("Error fetching currencies:", error)));
        fetchCars();

        if (api.isSuperuser) {
            fetchTenants();
        }
    };

    function fetchTenants() {
        let url = '/users/?all_data=true';
        api.get(url)
            .then((data) => (setTenants(data)))
            .catch((error) => (console.error("Error fetching tenants:", error)));
    }

    const handleFreeCarsChange = () => {
        setFreeCarsChecked(!freeCarsChecked);
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            key: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
            sx: { color: validationErrorsInTab(index) ? 'error.main' : 'currentValue'}
        };
    }

    function validationErrorsInTab(tabIndex) {
        for (const key in validationErrors) {
            if (tabColumnsObj[key] === tabIndex) {
                return true
            }
        }

        return false;
    }

    return (
        <form>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue}
                      aria-label="basic tabs example"
                      sx={{ color: validationErrorsInTab(tabValue) ? 'error.main' : 'primary' }}
                      onChange={handleTabChange}
                >
                    <Tab label="Basic info" {...a11yProps(0)} />
                    <Tab label="Relational data" {...a11yProps(1)} />
                    <Tab label="Image" {...a11yProps(2)} />
                </Tabs>
            </Box>
            {tabValue === 0 && (
                <Box sx={{ px: 3, py: 1, my: 1 }}>
                    <FormGroup style={{ marginBottom: '2rem'}}>
                        <TextField id="title"
                                   label="Title"
                                   variant="outlined"
                                   size="small"
                                   error={'title' in validationErrors}
                                   helperText={getValidationErrorText('title')}
                                   value={title}
                                   onChange={handleTitleChange} />

                        <TextField id="description"
                                   label="Description"
                                   variant="outlined"
                                   size="small"
                                   multiline
                                   rows={4}
                                   style={{marginTop: '1rem'}}
                                   error={'description' in validationErrors}
                                   helperText={getValidationErrorText('description')}
                                   value={description}
                                   onChange={handleDescriptionChange} />

                        <TextField id="price"
                                   label="Price"
                                   type="number"
                                   variant="outlined"
                                   size="small"
                                   style={{marginTop: '1rem'}}
                                   error={'price' in validationErrors}
                                   helperText={getValidationErrorText('price')}
                                   value={price}
                                   onChange={handlePriceChange} />
                    </FormGroup>
                </Box>
            )}
            {tabValue === 1 && (
                <Box sx={{ px: 3, py: 1, my: 1 }}>
                    <FormGroup sx={{ mb: 2 }}>
                        <FormControl sx={{ mt: 2 }} error={'currency_id' in validationErrors}>
                            <InputLabel id="currency-label">
                                Currency
                            </InputLabel>
                            <Select
                                labelId="body-type-label"
                                id="body-type"
                                value={currency}
                                label="Body type"
                                size="small"
                                onChange={handleCurrencyChange}
                            >
                                <MenuItem value={0}>
                                    <Box sx={{ color: 'text.secondary' }}>Select currency</Box>
                                </MenuItem>
                                {currencies.map(type => (
                                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)
                                )}
                            </Select>
                            {'currency_id' in validationErrors &&
                                <FormHelperText error>{validationErrors.currency_id}</FormHelperText>}
                        </FormControl>

                        <FormControl sx={{ mt: 2 }} error={'car_id' in validationErrors}>
                            <Box display="flex" alignItems="center">
                                <Box flexGrow={1}>
                                    <InputLabel id="car-label">
                                        Car
                                    </InputLabel>
                                    <Select
                                        labelId="car-label"
                                        sx={{ width: '90%' }}
                                        id="car"
                                        value={car}
                                        label="Car"
                                        size="small"
                                        onChange={handleCarChange}
                                    >
                                        <MenuItem value={0}>
                                            <Box sx={{ color: 'text.secondary' }}>Select car</Box>
                                        </MenuItem>
                                        {cars.map(car => (
                                            <MenuItem key={car.id} value={car.id}>
                                                <Typography component="span">
                                                    {car.model.manufacturer.name + ' ' + car.model.name + ' (' + car.vin + ')'}
                                                </Typography>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {'car_id' in validationErrors &&
                                        <FormHelperText error>{validationErrors.car_id}</FormHelperText>
                                    }
                                </Box>

                                <Box>
                                    <FormControlLabel control={
                                        <Checkbox checked={freeCarsChecked} onChange={handleFreeCarsChange} sx={{ mr: 1 }} />
                                    } label="Free cars only" />
                                </Box>
                            </Box>
                        </FormControl>
                        {api.isSuperuser && <FormControl sx={{ mt: 2 }} error={'created_by_id' in validationErrors}>
                            <InputLabel id="tenant-label">Tenant</InputLabel>
                            <Select
                                labelId="tenant-label"
                                id="tenant"
                                label="Tenant"
                                size="small"
                                value={tenant}
                                onChange={handleTenantChange}
                            >
                                <MenuItem value={0}>
                                    <Box sx={{ color: 'text.secondary' }}>
                                        Select tenant
                                    </Box>
                                </MenuItem>
                                {tenants.map(tenant => (
                                    <MenuItem key={tenant.id} value={tenant.id}>
                                        {`${tenant.first_name} ${tenant.last_name} (${tenant.email})`}
                                    </MenuItem>
                                ))}
                            </Select>
                            {'created_by_id' in validationErrors &&
                                <FormHelperText error>{validationErrors.model_id}</FormHelperText>
                            }
                        </FormControl>}
                    </FormGroup>
                </Box>
            )}
            {tabValue === 2 && (
                <Box sx={{ px: 3, py: 1, my: 1, borderColor: 'error.main' }}>
                    <FormControl error={'images_data' in validationErrors}>
                        <ImageUploader
                            labelId="car-advert-images"
                            buttonText="Upload car advert image"
                            presentImage
                            existingImages={existingImages}
                            handleUpdateExistingImages={handleUpdateExistingImages}
                            images={images}
                            setImages={handleSetImages}
                        />
                    </FormControl>
                    {'image' in validationErrors &&
                        <FormHelperText error>{validationErrors.image}</FormHelperText>
                    }
                </Box>
            )}
            <div style={{ padding: '1rem 2rem', marginBottm: '16px', display: 'flex', justifyContent: 'flex-end'}}>
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </div>
        </form>
    )
};

export default CarAdvertFormData;
