import { TextEventMessage } from '@line/bot-sdk';
import { ICommand } from '../interfaces/ICommand';

const BOTNAME_IDX = 0;
const INSTRUCTION_IDX = 1;
const ARGUMENTS_IDX = 2;

export function ParseCommand(text: string): ICommand {
    let textArr = text.split(' ');

    let command: ICommand = {
        botname: textArr[BOTNAME_IDX] || '',
        instruction: textArr[INSTRUCTION_IDX] || '',
        args: textArr[ARGUMENTS_IDX] || '',
    };
    return command;
}

export function MatchedCommandPattern(message: TextEventMessage): boolean {
    if (!message.text.startsWith('/')) return false;
    let messageWithoutFrontSlash = message.text.substr(1);

    let command = ParseCommand(messageWithoutFrontSlash);
    if (command.botname !== 'mb') return false;
    if (command.instruction === '') return false;
    return true;
}

