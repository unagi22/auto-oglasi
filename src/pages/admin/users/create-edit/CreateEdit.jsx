
import {Button, FormControl, FormGroup, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import ImageUploader from "../../../../components/ImageUploader.jsx";
import {isNil} from "lodash";
import {useEffect, useState} from "react";
import Api from "../../../../services/Api.js";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FormHelperText from '@mui/material/FormHelperText';
import {tabColumnsObj} from "./config.js";

const api = Api.getInstance();

const CreateEditUser = ({editItem = null, successCallable}) => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [images, setImages] = useState([]);
    const [countries, setCountries] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [tabValue, setTabValue] = useState(0);
    const [existingImages, setExistingImages] = useState([]);
    const [countriesFetched, setCountriesFetched] = useState(false)

    const handleEmailChange = (event) => (setEmail(event.target.value));
    const handlePasswordChange = (event) => (setPassword(event.target.value));
    const handleFirstNameChange = (event) => (setFirstName(event.target.value));
    const handleLastNameChange = (event) => (setLastName(event.target.value));
    const handleCountryChange = (event) => (setCountry(event.target.value));
    const handleEmailVerifiedChange = (event) => (setEmailVerified(event.target.value));
    const handleProfilePictureChange = (event) => (setProfilePicture(event.target.value));

    const getValidationErrorText = (key) => (validationErrors[key] && validationErrors[key][0] || '');

    const editMode = () => (!!editItem);

    const getFormData = () => {
        const payload = {
            first_name: firstName,
            last_name: lastName,
            email,
            country
        };

        if (!editMode()) {
            payload.password = password;
        }

        const formData = new FormData();

        for (const key in payload) {
            if (!isNil(payload[key]) && payload[key] !== 0) {
                formData.append(key, payload[key]);
            }
        }

        if (images[0]) {
            formData.append('profile_picture', images[0]);
        }
        if (editMode() && existingImages.length === 0) {
            formData.append('profile_picture', null);
        }

        return formData;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (editMode()) {
            api.patch(`/users/${editItem.id}/`, getFormData())
                .then(async (response) => {
                    const responseData = await response.json();
                    if (response.status === 200) {
                        successCallable()
                        console.log("User data successfully updated", response.data);
                    } else if (response.status === 400) {
                        setValidationErrors(responseData)
                        console.error("Error adding car data:", responseData);
                    }
                })
                .catch(error => {
                    console.log('error data', error)
                });
        } else {
            api.post('/users/', getFormData())
                .then(async (response) => {
                    const responseData = await response.json();
                    if (response.status === 201) {
                        successCallable()
                        console.log("User data successfully added");
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
        setFirstName(editItem.first_name);
        setLastName(editItem.last_name);
        setEmail(editItem.email);
        setCountry(editItem.country.code);
        setEmailVerified(editItem.email_verified);
        setExistingImages([{id: editItem.id, image: editItem.profile_picture}]);
    }

    useEffect(() => {
        if (editMode()) {
            setEditItemValues()
        }
        fetchRelatingData()
    }, []);

    function fetchRelatingData () {
        if (!countriesFetched) {
            api.get('/countries/')
                .then((data) => {
                    if(!editMode()) {
                        setCountry(data.default);
                    }
                    setCountries(data.countries)
                    setCountriesFetched(true);
                })
                .catch((error) => (console.error("Error fetching manufacturers:", error)));
        }
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
                <Box sx={{ p: 3, my: 1 }}>
                    <FormGroup style={{ marginBottom: '2rem'}}>
                        <TextField id="first-name"
                                   label="First name"
                                   variant="outlined"
                                   size="small"
                                   error={'first_name' in validationErrors}
                                   helperText={getValidationErrorText('first_name')}
                                   value={firstName}
                                   onChange={handleFirstNameChange} />

                        <TextField id="description"
                                   label="Last name"
                                   variant="outlined"
                                   size="small"
                                   multiline
                                   sx={{ mt: 2 }}
                                   error={'last_name' in validationErrors}
                                   helperText={getValidationErrorText('last_name')}
                                   value={lastName}
                                   onChange={handleLastNameChange} />

                        <TextField id="email"
                                   label="Email address"
                                   variant="outlined"
                                   size="small"
                                   sx={{ mt: 2 }}
                                   error={'email' in validationErrors}
                                   helperText={getValidationErrorText('email')}
                                   value={email}
                                   onChange={handleEmailChange} />

                        {!editMode() && <TextField id="password"
                                   label="Password"
                                   variant="outlined"
                                   size="small"
                                   type="password"
                                   sx={{ mt: 2 }}
                                   error={'password' in validationErrors}
                                   helperText={getValidationErrorText('password')}
                                   value={password}
                                   onChange={handlePasswordChange} />}
                    </FormGroup>
                </Box>
            )}
            {tabValue === 1 && (
                <Box sx={{ p: 3, my: 1 }}>
                    <FormGroup sx={{ mb: 2 }}>
                        <FormControl sx={{ mt: 2 }} error={'country' in validationErrors}>
                            <InputLabel id="currency-label">
                                Country
                            </InputLabel>
                            <Select
                                labelId="body-type-label"
                                id="body-type"
                                value={country}
                                label="Body type"
                                size="small"
                                onChange={handleCountryChange}
                            >
                                <MenuItem value={0}>
                                    <Box sx={{ color: 'text.secondary' }}>Select country</Box>
                                </MenuItem>
                                {Object.entries(countries).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>
                                        {value}
                                    </MenuItem>)
                                )}
                            </Select>
                            {'country' in validationErrors &&
                                <FormHelperText error>{validationErrors.country}</FormHelperText>}
                        </FormControl>
                    </FormGroup>
                </Box>
            )}
            {tabValue === 2 && (
                <Box sx={{ p: 3, my: 1, borderColor: 'error.main' }}>
                    <FormControl error={'profile_picture' in validationErrors}>
                        <ImageUploader
                            labelId="profile-picture"
                            buttonText="Upload profile picture"
                            presentImage
                            existingImages={existingImages}
                            handleUpdateExistingImages={handleUpdateExistingImages}
                            images={images}
                            setImages={handleSetImages}
                        />
                    </FormControl>
                    {'profile_picture' in validationErrors &&
                        <FormHelperText error>{validationErrors.profile_picture}</FormHelperText>
                    }
                </Box>
            )}
            <div style={{position: 'absolute', bottom: 0, right: 0, padding: '1rem 2rem', marginBottm: '16px', display: 'flex', justifyContent: 'flex-end'}}>
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </div>
        </form>
    )
};

export default CreateEditUser;
