export enum RecognizedInstructions {
    SUBSCRIBE = 'subscribe',
    UNSUBSCRIBE = 'unsubscribe',
}

// type RecognizedInstruction = RecognizedInstructionEnum | string;
export interface ICommand {
    botname: string;
    instruction: string;
    args: string;
}
