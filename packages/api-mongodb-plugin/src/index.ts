
import dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env`});

import api from './api';
import connectMongo from './config/mongo';

export {
  connectMongo
};

export default api
