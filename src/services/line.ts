import { Service, Inject } from 'typedi';
import { Logger } from '../loaders/logger';
import { Client, TextEventMessage, WebhookEvent, MessageEvent, TextMessage } from '@line/bot-sdk';
import { UnrecognizedInstructionError } from '../errors/DomainErrors';
import { RecognizedInstructions as RecognizedInstructionsEnum, ICommand } from '../interfaces/ICommand';
import { MatchedCommandPattern, ParseCommand } from '../utils';

@Service()
export default class LineHandler {
    constructor(
        @Inject('logger') private logger: Logger,
        @Inject('lineClient') private lineClient: Client,
        @Inject('projectListenerModel') private projectListenerModel: Models.ProjectListener,
    ) {}

    context = { location: 'LineService' };

    public async HandleEvents(lineEvents: WebhookEvent[]): Promise<void> {
        try {
            await Promise.all(
                lineEvents.map(async event => {
                    await this.HandleEvent(event);
                }),
            );
        } catch (error) {
            this.logger.error(error, { ...this.context, method: 'HandleEvents' }, 'Error line handle multiple events');
            throw error;
        }
    }

    private async HandleEvent(lineEvent: WebhookEvent): Promise<void> {
        try {
            if (lineEvent.type === 'message') {
                await this.HandleMessageEvent(lineEvent);
            }
        } catch (error) {
            this.logger.error(
                error,
                { ...this.context, method: 'HandleEvent', lineEvent },
                'Error line handle single event',
            );
            throw error;
        }
    }

    private async HandleMessageEvent(messageEvent: MessageEvent): Promise<void> {
        try {
            if (messageEvent.message.type === 'text') {
                await this.HandleTextMessageEvent(messageEvent);
            }
        } catch (error) {
            this.logger.error(
                error,
                { ...this.context, method: 'HandleMessageEvent', messageEvent },
                'Error line handle message event',
            );
            throw error;
        }
    }

    private async HandleTextMessageEvent(lineEvent: MessageEvent): Promise<void> {
        try {
            let message = lineEvent.message as TextEventMessage;

            if (!MatchedCommandPattern(message)) {
                this.lineClient.replyMessage(lineEvent.replyToken, {
                    type: 'text',
                    text: "Thanks to chat us, but I can't understand the instruction. I'm Sorry 😔",
                });
                return; //ignore message that doesn't comply with command format
            }

            let command = ParseCommand(message.text);
            await this.HandleCommand(lineEvent, command);
        } catch (error) {
            this.logger.error(
                error,
                { ...this.context, method: 'HandleTextMessageEvent', lineEvent },
                'Error handling text message event',
            );
            let reply: TextMessage = { type: 'text', text: `Error: ${error.message}` };
            this.lineClient.replyMessage(lineEvent.replyToken, reply);
            throw error;
        }
    }

    private async HandleCommand(lineEvent: MessageEvent, command: ICommand): Promise<void> {
        try {
            let recognizedInstructions: string[] = Object.values(RecognizedInstructionsEnum);
            if (!recognizedInstructions.includes(command.instruction)) {
                throw new UnrecognizedInstructionError(`Instruction not recognized`, { command });
            }

            if (command.instruction === RecognizedInstructionsEnum.SUBSCRIBE) {
                await this.RegisterNewProjectListener(lineEvent);
            } else if (command.instruction === RecognizedInstructionsEnum.UNSUBSCRIBE) {
                await this.UnregisterProjectListener(lineEvent);
            }
        } catch (error) {
            this.logger.error(error, { ...this.context, method: 'HandleCommand', command }, 'Error handling command');
            throw error;
        }
    }

    /* Project management business process */
    private async RegisterNewProjectListener(lineEvent: MessageEvent): Promise<void> {
        try {
            const { source } = lineEvent;

            let newListener = new this.projectListenerModel({
                type: source.type,
            });

            if (source.type === 'group') {
                newListener.lineid = source.groupId;
                let group = await this.lineClient.getGroupSummary(source.groupId);
                newListener.name = group.groupName;
            } else if (source.type === 'user') {
                newListener.lineid = source.userId;
                let user = await this.lineClient.getProfile(source.userId);
                newListener.name = user.displayName;
            } else {
                newListener.lineid = source.roomId;
            }

            const duplicate = await this.projectListenerModel.findOne({ lineid: newListener.lineid });
            if (duplicate) {
                throw new Error('You are already registered!');
            }

            await newListener.save();
            await this.ReplyMessage(lineEvent.replyToken, 'Thanks, I will notify you about new projects!');
        } catch (error) {
            this.logger.error(
                error,
                { ...this.context, method: 'RegisterNewProjectListener', lineEvent },
                'Failed to register project listener',
            );
            throw error;
        }
    }

    private async UnregisterProjectListener(lineEvent: MessageEvent): Promise<void> {
        try {
            const { source } = lineEvent;
            let lineid: string;

            if (source.type === 'group') {
                lineid = source.groupId;
            } else if (source.type === 'user') {
                lineid = source.userId;
            } else {
                lineid = source.roomId;
            }

            const listener = await this.projectListenerModel.findOne({ lineid });
            if (!listener) {
                throw new Error('You are not yet registered!');
            }

            await this.projectListenerModel.deleteOne({ lineid });
            await this.ReplyMessage(lineEvent.replyToken, 'Thanks, I will not notify you anymore!');
        } catch (error) {
            this.logger.error(
                error,
                { ...this.context, method: 'UnregisterProjectListener', lineEvent },
                'Failed to unregister project listener',
            );
            throw error;
        }
    }

    private async ReplyMessage(replyToken: string, message: string) {
        let reply: TextMessage = { type: 'text', text: message };
        await this.lineClient.replyMessage(replyToken, reply);
    }
}
