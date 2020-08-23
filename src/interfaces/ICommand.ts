export enum RecognizedInstructions {
    SUBSCRIBE = 'subscribe',
    UNSUBSCRIBE = 'unsubscribe',
}

export interface ICommand {
    botname: string;
    instruction: string;
    args: string;
}
