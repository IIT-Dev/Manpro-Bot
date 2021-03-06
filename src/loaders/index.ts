import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';
import Models from '../models';

export default async ({ expressApp }) => {
    await mongooseLoader();
    Logger.info('✌️ DB loaded and connected!');

    await dependencyInjectorLoader({
        models: Models,
    });
    Logger.info('✌️ Dependency Injector loaded');

    await expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');
};
