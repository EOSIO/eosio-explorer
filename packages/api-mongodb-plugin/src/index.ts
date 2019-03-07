
import dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env`});

import initMongo from './config/mongo';
initMongo();

import api from './api';

export default api
