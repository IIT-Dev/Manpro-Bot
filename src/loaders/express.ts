import express from 'express';
import cors from 'cors';
import routes from '../api';
import config from '../config';
import logger from './logger';
import { LineMiddleware } from './line';

export default ({ app }: { app: express.Application }) => {
    app.use((req, res, next) => {
        if (req.headers['X-Line-Signature']) {
            return LineMiddleware(req, res, next);
        }
        next();
    });

    logger.setupLoggingMiddleware(app);

    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    app.enable('trust proxy');

    app.use(cors());

    // Load API routes
    app.use(config.api.prefix, routes());

    /// catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        next(err);
    });

    // eslint-disable-next-line
    app.use((err, req, res, next) => {
        logger.error(err, { location: 'ExpressErrorHandler' }, 'Unexpected Error');
        res.status(500).send({
            payload: null,
            message: 'Unexpected error happened!',
        });
    });
};
