import { Router } from 'express';
import projectRequest from './routes/projectRequest';
import line from './routes/line';

export default () => {
    const app = Router();
    line(app);
    projectRequest(app);

    return app;
};
