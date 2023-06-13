import { FlexContainer } from '@line/bot-sdk';
import { IProjectRequest } from '../interfaces/IProjectRequest';

export function carouselBuilder(projects: IProjectRequest[]): FlexContainer {
    let contents = [];
    for (let project of projects) {
        contents.push({
            type: 'bubble',
            size: 'kilo',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    // for each project key, create a box with the key name and value
                    ...Object.keys(project).map((key) => {
                        return {
                            type: 'text',
                            text: `${key}: ${project[key]}`.substring(0, 30),
                            size: 'sm',
                            wrap: true,
                        };
                    }),
                ],
            }
        });
    }
    return {
        type: 'carousel',
        contents
    };
}