import { Container } from 'typedi';
import LoggerInstance from './logger';
import { LineClient, LineMiddleware } from './line';

export default ({ models }) => {
    try {
        models.forEach(({ name, model }) => {
            Container.set(name, model);
            model.createCollection();
        });

        Container.set('lineClient', LineClient);
        Container.set('lineMiddleware', LineMiddleware);
        Container.set('logger', LoggerInstance);
    } catch (err) {
        LoggerInstance.error(err, '🔥 Error on dependency injector loader');
        throw err;
    }
};
