import dayjs from "dayjs";

export const carConfigColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
        field: 'model',
        headerName: 'Model',
        valueGetter: (params) => params.row.model.manufacturer.name + ' ' + params.row.model.name,
        width: 120,
    },
    { field: 'vin', headerName: 'VIN', type: 'number', width: 90 },
    { field: 'cubic_capacity', headerName: 'Cubic capacity', type: 'number', width: 110 },
    { field: 'door_count', headerName: 'Door count', type: 'number', width: 90 },
    { field: 'seat_number', headerName: 'Seat number', type: 'number', width: 100 },
    {
        field: 'license_plate',
        headerName: 'License plate',
        width: 130,
    },
    {
        field: 'manufacture_year',
        headerName: 'Year',
        width: 60,
    },
    {
        field: 'mileage',
        headerName: 'Mileage',
        width: 90,
    },
    {
        field: 'power',
        description: 'Power in KW',
        headerName: 'Power',
        width: 80,
    },
    {
        field: 'registration_date',
        headerName: 'Registration date',
        valueGetter: (params) => dayjs(params.row.registration_date).format('DD/MM/YYYY'),
        width: 130,
    },
    {
        field: 'color',
        headerName: 'Color',
        valueGetter: (params) => params.row.color.name,
        width: 90,
    },
    {
        field: 'fuel_type',
        headerName: 'Fuel type',
        description: 'Fuel type acronym',
        valueGetter: (params) => params.row.fuel_type.code,
        width: 80,
    },
    {
        field: 'gearbox',
        headerName: 'Gearbox',
        description: 'Gearbox acronym',
        valueGetter: (params) => params.row.gearbox.code,
        width: 80,
    },
];

export const carAdvertConfigColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
        field: 'car',
        headerName: 'Car',
        valueGetter: (params) => {
            const car = params.row.car;
            return car.model.manufacturer.name + ' ' + car.model.name + ' ' + car.manufacture_year;
        },
        width: 180,
    },
    { field: 'title', headerName: 'Title', width: 120 },
    { field: 'description', headerName: 'Description', width: 300 },
    {
        field: 'price',
        headerName: 'Price',
        valueGetter: (params) => parseInt(params.row.price) + ' ' + params.row.currency.name,
        width: 100,
    },
    { field: 'is_active', headerName: 'Active', type: 'boolean', width: 100 },
];
