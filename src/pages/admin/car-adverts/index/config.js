export const dataGridColumnsConfig = [
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

export const multiTenancyColumns = [
    {
        field: 'created_by',
        headerName: 'User',
        valueGetter: (params) => params.row.created_by.email,
        width: 200,
    },
]
