export const dataGridColumnsConfig = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'first_name', headerName: 'First name', width: 120 },
    { field: 'last_name', headerName: 'Last name', width: 120 },
    { field: 'email', headerName: 'Email', width: 210 },
    {
        field: 'country',
        headerName: 'Country',
        valueGetter: (params) => params.row.country.name,
        width: 140,
    },
    { field: 'email_verified', headerName: 'Email verified', type: 'boolean', width: 130 },
];
