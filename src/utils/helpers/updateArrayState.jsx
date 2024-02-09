const updateArrayItemsById = (array, itemId, updatedItem) => {
    return array.map(item => item._id === itemId ? updatedItem : item);
};

export default updateArrayItemsById;