import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    Button,
    FormControl,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";

import styles from './admin.module.css';
import {useEffect, useState} from "react";
import api from "../services/Api.js";
import AppModal from "../components/app-modal.jsx";
import ImageUploader from "../components/ImageUploader.jsx";

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const Admin = () => {
    const [bodyTypes, setBodyTypes] = useState([]);
    const [carColors, setCarColors] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [gearboxes, setGearboxes] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [carImages, setCarImages] = useState([]);
    const [bodyType, setBodyType] = useState(0);
    const [color, setColor] = useState(0);
    const [fuelType, setFuelType] = useState(0);
    const [gearbox, setGearbox] = useState(0);
    const [manufacturer, setManufacturer] = useState(0);
    const [images, setImages] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [manufactureYear, setManufactureYear] = useState('');
    const [vin, setVin] = useState('');


    // useEffect(() => {
    //     fetchRelatingData()
    // }, []);

    useEffect(() => {
        const fetchRelatingData = async () => {
          try {
            const response = await api.get("car-body-types/");
            setBodyTypes(response.data);
          } catch (error) {
            console.error("Error fetching car body types:", error);
          }
          try {
            const response = await api.get("car-colors/");
            setCarColors(response.data);
          } catch (error) {
            console.error("Error fetching car colors:", error);
          }
          try {
            const response = await api.get("car-fuel-types/");
            setFuelTypes(response.data);
          } catch (error) {
            console.error("Error fetching fuel types:", error);
          }
          try {
            const response = await api.get("car-gearboxes/");
            setGearboxes(response.data);
          } catch (error) {
            console.error("Error fetching gearboxes:", error);
          }
          try {
            const response = await api.get("car-manufacturers/");
            setManufacturers(response.data);
          } catch (error) {
            console.error("Error fetching manufacturers:", error);
          }
        };
    
        fetchRelatingData()
      }, []);

    // const fetchRelatingData = () => {
    //     const api = new Api();
    //     api.get('/car-body-types/')
    //         .then((data) => (setBodyTypes(data)))
    //         .catch((error) => (console.error("Error fetching car body types:", error)));
    //     api.get('/car-colors/')
    //         .then((data) => (setCarColors(data)))
    //         .catch((error) => (console.error("Error fetching car colors:", error)));
    //     api.get('/car-fuel-types/')
    //         .then((data) => (setFuelTypes(data)))
    //         .catch((error) => (console.error("Error fetching fuel types:", error)));
    //     api.get('/car-gearboxes/')
    //         .then((data) => (setGearboxes(data)))
    //         .catch((error) => (console.error("Error fetching gearboxes:", error)));
    //     api.get('/car-manufacturers/')
    //         .then((data) => (setManufacturers(data)))
    //         .catch((error) => (console.error("Error fetching manufacturers:", error)));
    // };

    const handleManufactureYearChange = (event) => {
        setManufactureYear(event.target.value);
    };

    const handleVinChange = (event) => {
        setVin(event.target.value);
    };

    const handleBodyTypeChange = (event) => {
        setBodyType(event.target.value);
    };

    const handleColorChange = (event) => {
        setColor(event.target.value);
    };

    const handleFuelTypeChange = (event) => {
        setFuelType(event.target.value);
    };

    const handleGearboxChange = (event) => {
        setGearbox(event.target.value);
    };

    const handleManufacturerChange = (event) => {
        setManufacturer(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log('manufactureYear', manufactureYear)
        // Create the payload
        const payload = {
            manufacture_year: manufactureYear,
            vin: vin,
            body_type: bodyType,
            color: color,
            fuel_type: fuelType,
            gearbox: gearbox,
            manufacturer: manufacturer,
            images: images // This can be further processed if necessary, e.g., if you need to upload them somewhere
        };

        const api = new Api();
        api.post('/cars/', payload)
            .then(async (response) => {
                const responseData = await response.json();
                console.log('responseData', responseData)
                if (response.status === 200) {
                    console.log("Car data successfully added");
                } else if (response.status === 400) {
                    setValidationErrors(responseData)
                    setTimeout(() => {
                        console.log('validationErrors', validationErrors)
                    },300)
                    console.error("Error adding car data:", responseData);
                }
            })
            .catch(error => {
                console.log('error data', error)
            });
    }

    function createCarFormData() {
        return (
            <form onSubmit={handleSubmit}>
                <FormGroup style={{width: '50%', marginTop: '1rem'}}>
                    <TextField id="manufacture-year"
                               label="Enter manufacture year"
                               type="number"
                               variant="outlined"
                               size="small"
                               error={'manufacture_year' in validationErrors}
                               value={manufactureYear}
                               onChange={handleManufactureYearChange} />

                    <TextField id="vin"
                               label="Enter VIN value"
                               type="number"
                               variant="outlined"
                               size="small"
                               style={{marginTop: '1rem'}}
                               error={'vin' in validationErrors}
                               value={vin}
                               onChange={handleVinChange} />

                    <FormControl style={{marginTop: '1rem'}} error={'body_type' in validationErrors}>
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
                            <MenuItem value={0}>Select body type</MenuItem>
                            {bodyTypes.map(type => (<MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>))}
                        </Select>
                    </FormControl>

                    <FormControl style={{marginTop: '1rem'}} error={'color' in validationErrors}>
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
                            <MenuItem value={0}>Select color</MenuItem>
                            {carColors.map(color => (
                                <MenuItem key={color.id} value={color.id}>
                                    {color.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl style={{marginTop: '1rem'}} error={'fuel_type' in validationErrors}>
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
                            <MenuItem value={0}>Select fuel type</MenuItem>
                            {fuelTypes.map(fuelType => (<MenuItem key={fuelType.id} value={fuelType.id}>
                                {fuelType.name}
                            </MenuItem>))}
                        </Select>
                    </FormControl>

                    <FormControl style={{marginTop: '1rem'}} error={'gearbox' in validationErrors}>
                        <InputLabel id="gearbox-label" error={'gearbox' in validationErrors}>
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
                            <MenuItem value={0}>Select gearbox</MenuItem>
                            {gearboxes.map(gearbox => (
                                <MenuItem key={gearbox.id} value={gearbox.id}>
                                    {gearbox.description} ({gearbox.code})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <InputLabel id="manufacturer-label">Manufacturer</InputLabel>
                    <Select
                        labelId="manufacturer-label"
                        id="manufacturer"
                        value={manufacturer}
                        label="Manufacturer"
                        size="small"
                        onChange={handleManufacturerChange}
                    >
                        <MenuItem value={0}>Select manufacturer</MenuItem>
                        {manufacturers.map(manufacturer => (
                            <MenuItem key={manufacturer.id} value={manufacturer.id}>{manufacturer.name}</MenuItem>
                        ))}
                    </Select>

                    <InputLabel id="car-images">Images</InputLabel>

                    <ImageUploader buttonText="Upload car images" images={images} setImages={setImages} />
                </FormGroup>
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </form>
        )
    }

    function createCarAdvertFormData() {
        return (
            <TextField id="outlined-basic" label="Outlined" variant="outlined" size="small" />
        )
    }

    return (
        <div className={styles.pageContainer}>
            <h1>Admin</h1>
            <header className={styles.header}>
                <AppModal
                    buttonText="Create car"
                    title="Create car"
                    contents={createCarFormData()}
                />
                <AppModal
                    buttonText="Create advert"
                    title="Create car advert"
                    contents={createCarAdvertFormData()}
                />
            </header>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Dessert (100g serving)</TableCell>
                            <TableCell align="right">Calories</TableCell>
                            <TableCell align="right">Fat&nbsp;(g)</TableCell>
                            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                            <TableCell align="right">Protein&nbsp;(g)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Admin;
