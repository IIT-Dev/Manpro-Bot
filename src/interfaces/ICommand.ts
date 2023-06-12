export enum RecognizedInstructions {
    SUBSCRIBE = 'subscribe',
    UNSUBSCRIBE = 'unsubscribe',
    LIST = 'list',
}

export interface ICommand {
    botname: string;
    instruction: string;
    args: string;
}
