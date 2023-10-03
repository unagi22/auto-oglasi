const tab1 = ['manufacture_year', 'vin', 'mileage', 'cubic_capacity', 'power', 'door_count', 'seat_number', 'license_plate', 'registration_date'];
const tab2 = ['body_type_id', 'color_id', 'fuel_type_id', 'gearbox_id', 'model_id'];
const tab3 = ['images_data'];

const createGroupedObject = (keys, value) => {
    return keys.reduce((acc, key) => {
        acc[key] = value;
        return acc;
    }, {});
};

export const tabColumnsObj = {
    ...createGroupedObject(tab1, 0),
    ...createGroupedObject(tab2, 1),
    ...createGroupedObject(tab3, 3),
};
