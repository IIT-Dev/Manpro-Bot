import pino from 'pino';
import pinoHttp, {Options as pinoHttpOption} from 'pino-http';
import { Application, Request } from 'express';
import express from 'express';

export class Logger {
    private baseLogger: pino.Logger;

    constructor({ options, stream }: { options?: pino.LoggerOptions; stream?: pino.DestinationStream }) {
        const context = {
            environment: process.env.NODE_ENV || 'development',
            service: 'manpro-bot',
        };

        const defaultOptions: pino.LoggerOptions = {
            mixin() {
                return { ...context };
            },
            serializers: {
                error: pino.stdSerializers.err,
            },
        };

        const combinedOpts = { ...defaultOptions, ...options };
        const baseLogger = pino(combinedOpts, stream);
        this.baseLogger = baseLogger;
    }

    private createMiddlewareLogger(options?: pinoHttpOption) {
        const defaultOptions: pinoHttpOption = {
            logger: this.baseLogger,
            serializers: {
                req: (req: Request & { raw: { body: string } }) => {
                    req.body = req.raw.body;
                    return req;
                },
            },
        };

        return pinoHttp({ ...defaultOptions, ...options });
    }

    setupLoggingMiddleware(app: Application) {
        app.use(express.json());
        app.use(this.createMiddlewareLogger());
    }

    error(error: Error, msg: string): void;
    error(error: Error, context: object, msg?: string): void;
    error(error: Error, param2: string | object, param3: string = ''): void {
        if (typeof param2 === 'string') {
            this.baseLogger.error({ error }, param2);
        } else if (typeof param2 === 'object') {
            this.baseLogger.error({ error, ...param2 }, param3);
        }
    }

    warn(msg: string): void;
    warn(context: object, msg: string): void;
    warn(param1: string | object, param2?: string) {
        if (typeof param1 === 'string') {
            this.baseLogger.warn(param1);
        } else if (typeof param1 === 'object') {
            this.baseLogger.warn(param1, param2);
        }
    }

    info(msg: string): void;
    info(context: object, msg: string): void;
    info(param1: string | object, param2?: string) {
        if (typeof param1 === 'string') {
            this.baseLogger.info(param1);
        } else if (typeof param1 === 'object') {
            this.baseLogger.info(param1, param2);
        }
    }

    debug(msg: string): void;
    debug(context: object, msg: string): void;
    debug(param1: string | object, param2?: string) {
        if (typeof param1 === 'string') {
            this.baseLogger.debug(param1);
        } else if (typeof param1 === 'object') {
            this.baseLogger.debug(param1, param2);
        }
    }
}

const LoggerInstance = new Logger({ options: { 
    transport: process.env.NODE_ENV !== 'production'? {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
    } : undefined
} });

export default LoggerInstance;
