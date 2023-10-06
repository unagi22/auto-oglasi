import {FormGroup} from "@mui/material";
import Box from '@mui/material/Box';
import {useEffect} from "react";
import {Card} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import ShowItemCard from "./show-item-card.jsx";

const CarAdvertFormData = ({advert}) => {
    useEffect(() => {
        console.log('carAdvert', advert)
    })
    return (
        <Box sx={{ p: 3, my: 1, overflowX: 'scroll' }}>
            <FormGroup sx={{ mb: 2 }}>
                <Card variant="outlined">
                    <Typography level="h1">{advert.title}</Typography>
                    <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
                        {parseInt(advert.price)}
                    </Typography>
                    <Typography>
                        {advert.description}
                    </Typography>
                </Card>

                <Typography level="h3" align="center" sx={{ mt: 3 }}>Car details:</Typography>

                <Box sx={{ my: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <ShowItemCard title="Car" description={advert.car.model.manufacturer.name + ' ' + advert.car.model.name} />
                    <ShowItemCard title="Manufacture year" description={advert.car.manufacture_year} />
                    <ShowItemCard title="Vehicle identification number (VIN)" description={advert.car.vin} />
                </Box>
                <Box sx={{ my: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <ShowItemCard title="Cubic capacity" description={advert.car.cubic_capacity} />
                    <ShowItemCard title="Mileage" description={advert.car.mileage} />
                    <ShowItemCard title="License plate" description={advert.car.license_plate} />
                </Box>
                <Box sx={{ my: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <ShowItemCard title="Power (kw)" description={advert.car.power} />
                    <ShowItemCard title="Door count" description={advert.car.door_count} />
                    <ShowItemCard title="Seat number" description={advert.car.seat_number} />
                </Box>
                <Box sx={{ my: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <ShowItemCard title="Body type" description={advert.car.body_type.name} />
                    <ShowItemCard title="Color" description={advert.car.color.name} />
                    <ShowItemCard title="Fuel type" description={advert.car.fuel_type.name} />
                </Box>
                <Box sx={{ my: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <ShowItemCard title="Gearbox" description={advert.car.gearbox.description + '(' + advert.car.gearbox.code + ')'} />
                    {advert.car.status && <ShowItemCard title="Status" description={advert.car.status.code} />}
                </Box>
            </FormGroup>
        </Box>
    )
};

export default CarAdvertFormData;
