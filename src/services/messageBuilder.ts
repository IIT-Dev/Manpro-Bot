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
                            text: `${key}: ${(project[key] as string).slice(0, 25)}`
                            + (project[key].length > 25 ? '...' : ''),
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