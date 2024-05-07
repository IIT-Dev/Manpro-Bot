import { Client, TextMessage } from '@line/bot-sdk';
import { Inject, Service } from 'typedi';
import { RequestError } from '../errors/DomainErrors';
import { IProjectRequest } from '../interfaces/IProjectRequest';
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
        try{
            let textArr = [];
            textArr.push(`[New Project]`);
            textArr.push(`Client Name: ${projectReq.name}`);
            textArr.push(`Email: ${projectReq.email}`);
            textArr.push(`Whatsapp: ${projectReq.whatsapp}`);
            textArr.push(`Institution: ${projectReq.institution}`);
            textArr.push(`Is ITB Student?: ${projectReq.isITB}`);
            textArr.push(`Project Type: ${(projectReq.type)}`);
            textArr.push(`Purpose: ${(projectReq.purpose)}`);
            textArr.push(`Description: ${(projectReq.description)}`);
            textArr.push(`Budget: ${(projectReq.budget)}`);
            textArr.push(`Deadline: ${(projectReq.deadline)}`);
            textArr.push(`Has Design?: ${(projectReq.hasDesign)}`);
            textArr.push(`Question: ${(projectReq.question)}`);
            textArr.push(``);
            textArr.push(`[Web Survey]`);
            textArr.push(`Know IIT from: ${(projectReq.referer ?? []).join(', ')}`);
            textArr.push(`Rating: ${projectReq.rating}`);
            textArr.push(`Feedback: ${projectReq.feedback}`);

            return textArr.join('\n');

        } catch (err) {
            throw new RequestError("Invalid request input", err)
        }
    }
}
