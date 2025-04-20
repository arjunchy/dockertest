import express from 'express';
import { addNewItem, getAllItems, getItemById, updateItem, deleteItem } from './item-controller.js';

const route = express.Router();


route.post('/newitem',addNewItem )

route.get('/items', getAllItems)

route.get('/items/:id', getItemById )

route.put('/items/:id', updateItem)

route.delete('/items/:id', deleteItem)


export default route;