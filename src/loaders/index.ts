import Models from '../models';
import dependencyInjectorLoader from './dependencyInjector';
import expressLoader from './express';
import Logger from './logger';

export default async ({ expressApp }) => {
    // not used anymore
    /* await mongooseLoader();
    Logger.info('✌️ DB loaded and connected!'); */

    await dependencyInjectorLoader({
        models: Models,
    });
    Logger.info('✌️ Dependency Injector loaded');

    await expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');
};
