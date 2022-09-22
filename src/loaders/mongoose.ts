import mongoose, { Mongoose } from 'mongoose';
import { Db } from 'mongodb';
import config from '../config';
import Logger from './logger';

export default async (): Promise<Db> => {
    try {
        let connection: Mongoose = await mongoose.connect(config.databaseURI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            minPoolSize: 10,
            autoIndex: true,
            serverSelectionTimeoutMS: 3500,
            
        });

        return connection.connection.db;
    } catch (error) {
        Logger.error(error, '[MongooseLoader]: Failed to connect to database.');
        process.exit(1);
    }
};
