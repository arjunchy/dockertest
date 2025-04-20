import express from 'express';
import cors from 'cors';
import route from './routes.js';
import connectDB from './db.js';

const app = express();

app.use(cors()); 

app.use(express.json());

connectDB();

app.use('/',route);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);
