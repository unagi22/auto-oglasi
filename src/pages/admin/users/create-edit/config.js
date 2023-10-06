const tab1 = ['first_name', 'last_name', 'email', 'password'];
const tab2 = ['country'];
const tab3 = ['profile_picture'];

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
