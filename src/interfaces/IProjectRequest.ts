enum projectType {
    'Website',
    'Aplikasi Android',
    'Aplikasi iOS',
    'Game',
    'Prototype',
    'Mockup',
}
export interface IProjectRequest {
    name: string;
    instance: string;
    isStudent: string;
    major: string;
    classOf: string;
    email: string;
    whatsapp: string;
    line: string;
    type: projectType[];
    motive: string;
    description: string;
    fee: number;
    deadline: Date;
    isDesignExist: string;
    design: string;
    notes: string;
    question: string;
}
