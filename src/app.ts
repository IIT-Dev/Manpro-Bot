import 'reflect-metadata'; // We need this in order to use @Decorators
import config from './config';
import express from 'express';
import Logger from './loaders/logger';
import loader from './loaders';

async function startServer() {
    const app = express();

    await loader({ expressApp: app });

    app.listen(config.port, err => {
        if (err) {
            Logger.error(err, 'Failed to load application');
            process.exit(1);
        }
        Logger.info(`
        ################################################
        🛡️  Server listening on port: ${config.port} 🛡️
        ################################################
        `);
    });
}

try {
    startServer().catch(err => {
        throw err;
    });
} catch (error) {
    Logger.error(error, 'Initialization error');
}
