import { Client, middleware } from '@line/bot-sdk';
import config from '../config';

export const LineClient = new Client({ channelAccessToken: config.line.channelAccessToken });

export const LineMiddleware = middleware({ channelSecret: config.line.channelSecret });
