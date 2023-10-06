import {Button, FormControl, FormGroup, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import BasicDatePicker from "../../../../components/basic-date-picker.jsx";
import ImageUploader from "../../../../components/ImageUploader.jsx";
import {isNil} from "lodash";
import {useEffect, useState} from "react";
import Api from "../../../../services/Api.js";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ChipsArray from "../../../../components/chips-array.jsx";
import FormHelperText from '@mui/material/FormHelperText';
import {tabColumnsObj} from "./config.js";

const api = Api.getInstance();

const CarFormData = ({editItem = null, successCallable}) => {
    const [bodyTypes, setBodyTypes] = useState([]);
    const [carColors, setCarColors] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [gearboxes, setGearboxes] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [carImages, setCarImages] = useState([]);
    const [features, setFeatures] = useState([]);
    const [featureIds, setFeatureIds] = useState([]);
    // const [initialFeatureIds, setInitialFeatureIds] = useState([]);
    const [bodyType, setBodyType] = useState(0);
    const [color, setColor] = useState(0);
    const [fuelType, setFuelType] = useState(0);
    const [gearbox, setGearbox] = useState(0);
    const [manufacturer, setManufacturer] = useState(0);
    const [model, setModel] = useState(0);
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [manufactureYear, setManufactureYear] = useState('');
    const [vin, setVin] = useState('');
    const [mileage, setMileage] = useState('');
    const [cubicCapacity, setCubicCapacity] = useState('');
    const [power, setPower] = useState('');
    const [registrationDate, setRegistrationDate] = useState(undefined);
    const [doorCount, setDoorCount] = useState('');
    const [seatNumber, setSeatNumber] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [featuresFetched, setFeaturesFetched] = useState(false);

    const editMode = () => (!!editItem);

    const handleManufactureYearChange = (event) => {
        setManufactureYear(event.target.value)
    };
    const handleVinChange = (event) => (setVin(event.target.value));
    const handleMileageChange = (event) => (setMileage(event.target.value));
    const handleCubicCapacityChange = (event) => (setCubicCapacity(event.target.value));
    const handlePowerChange = (event) => (setPower(event.target.value));
    const handleDoorCountChange = (event) => (setDoorCount(event.target.value));
    const handleBodyTypeChange = (event) => (setBodyType(event.target.value));
    const handleColorChange = (event) => (setColor(event.target.value));
    const handleFuelTypeChange = (event) => (setFuelType(event.target.value));
    const handleGearboxChange = (event) => (setGearbox(event.target.value));
    const handleModelChange = (event) => (setModel(event.target.value));
    const handleSeatNumberChange = (event) => (setSeatNumber(event.target.value));
    const handleLicensePlateChange = (event) => (setLicensePlate(event.target.value));

    const handleRegistrationDateChange = (dayjsObject) => {
        if (dayjsObject) {
            setRegistrationDate(dayjsObject.format('YYYY-MM-DD'));
        }
    };
    const handleClearRegistrationDate = () => (setRegistrationDate(undefined));

    const handleManufacturerChange = (event) => {
        const manufacturerId = event.target.value
        setManufacturer(manufacturerId);
    };

    const handleUpdateExistingImages = (newImages) => {
        setExistingImages(newImages);
    };

    const getValidationErrorText = (key) => (validationErrors[key] && validationErrors[key][0] || '');

    const getFormData = () => {
        const payload = {
            manufacture_year: manufactureYear,
            vin,
            mileage,
            cubic_capacity: cubicCapacity,
            power,
            door_count: doorCount,
            seat_number: seatNumber,
            license_plate: licensePlate,
            registration_date: registrationDate,
            body_type_id: bodyType,
            color_id: color,
            fuel_type_id: fuelType,
            gearbox_id: gearbox,
            model_id: model,
        };

        const formData = new FormData();

        for (const key in payload) {
            if (!isNil(payload[key]) && payload[key] !== 0) {
                formData.append(key, payload[key]);
            }
        }

        featureIds.forEach(featureId => (formData.append('feature_ids', featureId)));

        if (editMode()) {
            existingImages.forEach(image => formData.append('image_ids', image.id));
        }
        images.forEach(imageFile => (formData.append('images_data', imageFile)));

        return formData;
    };

    const setEditItemValues = () => {
        setManufactureYear(editItem.manufacture_year);
        setVin(editItem.vin);
        setMileage(editItem.mileage);
        setCubicCapacity(editItem.cubic_capacity);
        setPower(editItem.power);
        setDoorCount(editItem.door_count);
        setSeatNumber(editItem.seat_number);
        setLicensePlate(editItem.license_plate);
        setRegistrationDate(editItem.registration_date);
        setBodyType(editItem.body_type.id);
        setColor(editItem.color.id);
        setFuelType(editItem.fuel_type.id);
        setGearbox(editItem.gearbox.id);
        setManufacturer(editItem.model?.manufacturer?.id);
        setModel(editItem.model.id);

        const featureIdsSet = new Set(editItem.features.map(feature => feature.id));

        const selectedFeatures = features.map(feature => {
            feature.selected = featureIdsSet.has(feature.id);
            return feature;
        });
        setFeatures(selectedFeatures);

        setExistingImages(editItem.images)
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (editMode()) {
            api.patch(`/cars/${editItem.id}/`, getFormData())
                .then(async (response) => {
                    const responseData = await response.json();
                    if (response.status === 200) {
                        successCallable()
                        console.log("Car data successfully updated", response.data);
                    } else if (response.status === 400) {
                        setValidationErrors(responseData)
                        console.error("Error adding car data:", responseData);
                    }
                })
                .catch(error => {
                    console.log('error data', error)
                });
        } else {
            api.post('/cars/', getFormData())
                .then(async (response) => {
                    const responseData = await response.json();
                    if (response.status === 201) {
                        console.log("Car data successfully added");
                        successCallable()
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

    function fetchFeatures() {
        api.get('/car-features/')
            .then((data) => {
                setFeatures(data.map((feature, index) => ({key: index, id: feature.id, label: feature.name, selected: false})))
                setFeaturesFetched(true);
            })
            .catch((error) => (console.error("Error fetching manufacturers:", error)));
    }

    useEffect(() => {
        const fetchDataAndSetValues = async () => {
            await fetchRelatingData();

            if (editMode()) {
                setEditItemValues();
            }
        };

        fetchDataAndSetValues();
    }, [editItem]);

    useEffect(() => {
        if (manufacturer) {
            api.get(`/manufacturers/${manufacturer}/models`)
                .then((data) => (setModels(data)))
                .catch((error) => (console.error("Error fetching car body types:", error)));
        }
    }, [manufacturer]);

    const fetchRelatingData = () => {
        api.get('/car-body-types/')
            .then((data) => (setBodyTypes(data)))
            .catch((error) => (console.error("Error fetching car body types:", error)));
        api.get('/car-colors/')
            .then((data) => (setCarColors(data)))
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

        if (!featuresFetched) {
            fetchFeatures()
        }
    };

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
                    <Tab label="Features" {...a11yProps(2)} />
                    <Tab label="Images" {...a11yProps(3)} />
                </Tabs>
            </Box>
            {tabValue === 0 && (
                <Box sx={{ p: 3, my: 1 }}>
                    <FormGroup sx={{ mb: 2 }}>
                        <TextField id="manufacture-year"
                                   label="Manufacture year"
                                   type="number"
                                   variant="outlined"
                                   size="small"
                                   error={'manufacture_year' in validationErrors}
                                   helperText={getValidationErrorText('manufacture_year')}
                                   value={manufactureYear}
                                   onChange={handleManufactureYearChange} />

                        <TextField id="vin"
                                   label="Vehicle identification number (VIN)"
                                   type="number"
                                   variant="outlined"
                                   size="small"
                                   style={{marginTop: '1rem'}}
                                   error={'vin' in validationErrors}
                                   helperText={getValidationErrorText('vin')}
                                   value={vin}
                                   onChange={handleVinChange} />

                        <TextField id="mileage"
                                   label="Mileage"
                                   type="number"
                                   variant="outlined"
                                   size="small"
                                   style={{marginTop: '1rem'}}
                                   error={'mileage' in validationErrors}
                                   helperText={getValidationErrorText('mileage')}
                                   value={mileage}
                                   onChange={handleMileageChange} />

                        <TextField id="cubic-capacity"
                                   label="Cubic capacity"
                                   type="number"
                                   variant="outlined"
                                   size="small"
                                   style={{marginTop: '1rem'}}
                                   error={'cubic_capacity' in validationErrors}
                                   helperText={getValidationErrorText('cubic_capacity')}
                                   value={cubicCapacity}
                                   onChange={handleCubicCapacityChange} />

                        <TextField id="power"
                                   label="Power"
                                   type="number"
                                   variant="outlined"
                                   size="small"
                                   style={{marginTop: '1rem'}}
                                   error={'power' in validationErrors}
                                   helperText={getValidationErrorText('power')}
                                   value={power}
                                   onChange={handlePowerChange} />

                        <TextField id="door-count"
                                   label="Door count"
                                   type="number"
                                   variant="outlined"
                                   size="small"
                                   style={{marginTop: '1rem'}}
                                   error={'door_count' in validationErrors}
                                   helperText={getValidationErrorText('door_count')}
                                   value={doorCount}
                                   onChange={handleDoorCountChange} />

                        <TextField id="seat-number"
                                   label="Seat number"
                                   type="number"
                                   variant="outlined"
                                   size="small"
                                   style={{marginTop: '1rem'}}
                                   error={'seat_number' in validationErrors}
                                   helperText={getValidationErrorText('seat_number')}
                                   value={seatNumber}
                                   onChange={handleSeatNumberChange} />

                        <TextField id="license-plate"
                                   label="License plate"
                                   variant="outlined"
                                   size="small"
                                   style={{marginTop: '1rem'}}
                                   error={'license_plate' in validationErrors}
                                   helperText={getValidationErrorText('license_plate')}
                                   value={licensePlate}
                                   onChange={handleLicensePlateChange} />

                        <FormControl error={true}>
                            <BasicDatePicker title="Registration date"
                                             dateValue={editItem?.registration_date || null}
                                             changeHandler={handleRegistrationDateChange}
                                             clearHandler={handleClearRegistrationDate}
                                             helperText={'registration_date' in validationErrors ? getValidationErrorText('registration_date') : null} />
                        </FormControl>
                    </FormGroup>
                </Box>
            )}
            {tabValue === 1 && (
                <Box sx={{ p: 3, my: 1 }}>
                    <FormGroup sx={{ mb: 2 }}>
                        <FormControl sx={{ mt: 2 }} error={'body_type_id' in validationErrors}>
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
                            {'body_type_id' in validationErrors &&
                                <FormHelperText error>{validationErrors.body_type_id}</FormHelperText>}
                        </FormControl>

                        <FormControl sx={{ mt: 2 }} error={'color_id' in validationErrors}>
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
                                {carColors.map(color => (
                                    <MenuItem key={color.id} value={color.id}>
                                        {color.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {'color_id' in validationErrors &&
                                <FormHelperText error>{validationErrors.color_id}</FormHelperText>
                            }
                        </FormControl>

                        <FormControl sx={{ mt: 2 }} error={'fuel_type_id' in validationErrors}>
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
                            {'fuel_type_id' in validationErrors &&
                                <FormHelperText error>{validationErrors.fuel_type_id}</FormHelperText>
                            }
                        </FormControl>

                        <FormControl sx={{ mt: 2 }} error={'gearbox_id' in validationErrors}>
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
                            {'gearbox_id' in validationErrors &&
                                <FormHelperText error>{validationErrors.gearbox_id}</FormHelperText>
                            }
                        </FormControl>

                        <FormControl sx={{ mt: 2 }}>
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

                        <FormControl sx={{ mt: 2 }} error={'model_id' in validationErrors}>
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
                            {'model_id' in validationErrors &&
                                <FormHelperText error>{validationErrors.model_id}</FormHelperText>
                            }
                        </FormControl>
                    </FormGroup>
                </Box>
            )}
            {tabValue === 2 && (
                <Box sx={{ p: 3, my: 1 }}>
                    <ChipsArray chipsList={features} setSelectedIds={setFeatureIds} />
                </Box>
            )}
            {tabValue === 3 && (
                <Box sx={{ p: 3, my: 1, borderColor: 'error.main' }}>
                    <FormControl error={'images_data' in validationErrors}>
                        <ImageUploader
                            labelId="car-images"
                            buttonText="Upload car images"
                            multiple
                            existingImages={existingImages}
                            handleUpdateExistingImages={handleUpdateExistingImages}
                            images={images}
                            setImages={setImages}
                        />
                    </FormControl>
                    {'images_data' in validationErrors &&
                        <FormHelperText error>{validationErrors.images_data}</FormHelperText>
                    }
                </Box>
            )}
            <Box style={{position: 'absolute', bottom: 0, right: 0, padding: '1rem 2rem', marginBottom: '8px', display: 'flex', justifyContent: 'flex-end'}}>
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </Box>
        </form>
    )
};

export default CarFormData;
