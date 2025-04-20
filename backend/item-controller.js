import Item from './itemSchema.js';

export const addNewItem = async (request, response) => {
    const newItem = new Item(request.body);
    const result = await newItem.save();
    response.status(201).json(result);
};

export const getAllItems = async (request, resposne) => {
    const items = await Item.find();
    (!items) ? resposne.status(404).send('No items found') : resposne.status(200).json(items);
}

export const getItemById = async (request, response) => {
    const item = await Item.findById(request.params.id);
    if (!item) {
        return response.status(404).send('Item not found');
    }
    response.status(200).json(item);
}

export const updateItem = async (request, response) => {
    const updatedItem = await Item.findByIdAndUpdate(request.params.id, request.body, { new: true });
    if (!updatedItem) {
        return response.status(404).send('Item not found');
    }
    response.status(200).json(updatedItem);
}

export const deleteItem = async (request, response) => {
    const deletedItem = await Item.findByIdAndDelete(request.params.id);
    if (!deletedItem) {
        return response.status(404).send('Item not found');
    }
    response.status(200).json(deletedItem);
}
