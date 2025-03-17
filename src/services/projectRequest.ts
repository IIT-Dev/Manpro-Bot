import { Service, Inject } from 'typedi';
import { IProjectRequest } from '../interfaces/IProjectRequest';
import { Client, TextMessage } from '@line/bot-sdk';
import moment from 'moment';
import { Logger } from '../loaders/logger';
import { RequestError } from '../errors/DomainErrors';

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
        try{
            console.log(projectReq);
            let textArr = [];
            textArr.push(`[New Project]`);
            textArr.push(`Client: ${projectReq.name}`);
            textArr.push(`Agency: ${projectReq.instance}`);
            textArr.push(`Is ITB Student: ${projectReq.isStudent === 'Ya'}`);
            if (projectReq.major) {
                textArr.push(`Majors: ${projectReq.major}`);
            }
            if (projectReq.classOf) {
                textArr.push(`Majors: ${projectReq.classOf}`);
            }
    
            textArr.push(`Email: ${projectReq.email}`);
            textArr.push(`Whatsapp: ${projectReq.whatsapp}`);
            if (projectReq.line) {
                textArr.push(`Line: ${projectReq.line}`);
            }
            textArr.push(`Type: ${(projectReq.type ?? []).join(', ')}`);
            textArr.push(`Motive: ${projectReq.motive}`);
            textArr.push(`Description: ${projectReq.description}`);
            if (projectReq.fee) {
                textArr.push(`Expected Fee: Rp${projectReq.fee.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')}`);
            }
            if (projectReq.deadline) {
                let date = moment(projectReq.deadline, 'DD/MM/YYYY').format('DD MMMM YYYY');
                textArr.push(`Deadline: ${date}`);
            }
            if (projectReq.isDesignExist) {
                textArr.push(`Design: ${projectReq.isDesignExist}`);
            }
            if (projectReq.notes) {
                textArr.push(`Notes: ${projectReq.notes}`);
            }
            if (projectReq.question) {
                textArr.push(`Notes: ${projectReq.question}`);
            }
            return textArr.join('\n');

        } catch (err) {
            throw new RequestError("Invalid request input", err)
        }
    }
}
