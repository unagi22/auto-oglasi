const tab1 = ['title', 'description', 'price'];
const tab2 = ['currency_id', 'car_id'];
const tab3 = ['image'];

const createGroupedObject = (keys, value) => {
    return keys.reduce((acc, key) => {
        acc[key] = value;
        return acc;
    }, {});
};

export const tabColumnsObj = {
    ...createGroupedObject(tab1, 0),
    ...createGroupedObject(tab2, 1),
    ...createGroupedObject(tab3, 2),
};
