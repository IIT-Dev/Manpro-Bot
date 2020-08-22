import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';
import Models from '../models';
//We have to import at least all the events once so they can be triggered

export default async ({ expressApp }) => {
    await mongooseLoader();
    Logger.info('✌️ DB loaded and connected!');

    // It returns the agenda instance because it's needed in the subsequent loaders
    await dependencyInjectorLoader({
        models: Models,
    });
    Logger.info('✌️ Dependency Injector loaded');

    await expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');
};
