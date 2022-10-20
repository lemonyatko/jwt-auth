import { config } from 'dotenv';
config();

import express from 'express';
import { Request, Response } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router } from './router';
import { errorMiddleware } from './middleware/ErrorMiddleware';

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL ?? '';

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware);


async function start() {
    try {
        await connect(DB_URL);

        app.get('/', (request: Request, response: Response) => {
            response.send('Application started');
        });

        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`);
        });
    }
    catch (e) {
        console.log('Error happened', e);
    }
}

start();