import axios from 'axios';
import { IProjectRequest } from '../interfaces/IProjectRequest';

// TODO: Add types

export async function fetchSheets() : Promise<any[]> {
    axios.get(
        'https://script.google.com/macros/s/AKfycby5w9hVeQ_2mxVn4PywmmoP1GIR1KgbQ7YqcxF49cCO4Kg6QCZC9KUuP86hYsnrjsKH/exec',
    ).then((res) => {
        return res.data.result as IProjectRequest[];
    }).catch((err) => {return ['error']});
    return [];
}