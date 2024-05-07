export interface IProjectRequest {
    name: string;
    email: string;
    whatsapp: string;
    institution: string;
    isITB: string;
    type: string;
    purpose: string;
    description: string;
    budget: number;
    deadline: Date;
    hasDesign: string;
    question: string;
    referer: string[];
    rating: number;
    feedback: string;
}
