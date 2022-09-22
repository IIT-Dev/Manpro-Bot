import { Router, Response, Request, NextFunction } from 'express';
import { IProjectRequest } from '../../interfaces/IProjectRequest';
import { Container } from 'typedi';
import ProjectRequestService from '../../services/projectRequest';
import { Logger } from '../../loaders/logger';
import { RequestError } from '../../errors/DomainErrors';

export default (app: Router) => {
    const route = Router();
    const logger = Container.get('logger') as Logger;
    const projectRequestService = Container.get(ProjectRequestService);
    const context = { location: 'ProjectRequestRoute' };

    route.post('/', async (req: Request, res: Response, next: NextFunction) => {
        try {
            let projectRequest: IProjectRequest = req.body;

            await projectRequestService.NotifyRegisteredListeners(projectRequest);
            res.status(200).json({
                payload: null,
                message: 'success',
            });
        } catch (error) {
            if (error instanceof RequestError) {
                logger.error(
                    error,
                    { ...context, req: req.body, method: 'NewProjectRequest' },
                    'Invalid Request input',
                );

                return res.status(400).json({
                    payload: null,
                    message: 'Invalid Request input',
                });
            }
            logger.error(
                error,
                { ...context, req: req.body, method: 'NewProjectRequest' },
                'Error when responding to project request',
            );
            next(error);
        }
    });

    app.use('/project_request', route);
};
