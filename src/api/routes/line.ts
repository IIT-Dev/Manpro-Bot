import { Router, Response, Request } from 'express';
import { Container } from 'typedi';
import LineHandler from '../../services/line';
import { Logger } from '../../loaders/logger';

export default (app: Router) => {
    const route = Router();
    const logger = Container.get('logger') as Logger;
    const lineHandler = Container.get(LineHandler);
    const context = { location: 'LineRoute' };

    route.post('/line', async (req: Request, res: Response) => {
        try {
            res.status(200).send(); // Directly  return 200, we return error through line message
            logger.info({ ...context, body: req.body }, `Received line callback!`);
            await lineHandler.HandleEvents(req.body.events);
        } catch (error) {
            logger.error(error, { ...context }, 'Error in handling line request');
        }
    });

    app.use('/client', route);
};
