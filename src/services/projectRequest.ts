import { Service, Inject } from 'typedi';
import { IProjectRequest } from '../interfaces/IProjectRequest';
import { Client, TextMessage } from '@line/bot-sdk';
import moment from 'moment';
import { Logger } from '../loaders/logger';

@Service()
export default class ProjectRequest {
    constructor(
        @Inject('logger') private logger: Logger,
        @Inject('lineClient') private line: Client,
        @Inject('projectListenerModel') private projectListenerModel: Models.ProjectListener,
    ) {}
    context = { location: 'ProjectRequestService' };

    public async NotifyRegisteredListeners(projectRequest: IProjectRequest): Promise<void> {
        try {
            const listeners = await this.projectListenerModel.find();

            await Promise.all(
                listeners.map(async listener => {
                    let message: TextMessage = { type: 'text', text: this.ConvertProjectRequestToText(projectRequest) };
                    await this.line.pushMessage(listener.lineid, message);
                }),
            );
        } catch (error) {
            this.logger.error(error, {
                ...this.context,
                method: 'NotifyRegisteredListeners',
                projectRequest,
            });
            throw error;
        }
    }

    private ConvertProjectRequestToText(projectReq: IProjectRequest): string {
        let textArr = [];
        textArr.push(`[New Project]`);
        textArr.push(`Client: ${projectReq.name}`);
        textArr.push(`Agency: ${projectReq.instance}`);
        textArr.push(`Email: ${projectReq.email}`);
        textArr.push(`Whatsapp: ${projectReq.whatsapp}`);
        textArr.push(`Line: ${projectReq.line}`);
        textArr.push(`Type: ${projectReq.type.join(', ')}`);
        textArr.push(`Motive: ${projectReq.motive}`);
        textArr.push(`Fee: Rp${projectReq.fee.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')}`);
        let date = moment(projectReq.deadline, 'DD/MM/YYYY').format('DD MMMM YYYY');
        textArr.push(`Deadline: ${date}`);
        textArr.push(`Description: ${projectReq.description}`);
        return textArr.join('\n');
    }
}
