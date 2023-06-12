import fetch from 'node-fetch';
import { IProjectRequest } from '../interfaces/IProjectRequest';

// TODO: Add types

export async function fetchSheets() : Promise<Object> {
    return fetch(
        'https://script.google.com/macros/s/AKfycby5w9hVeQ_2mxVn4PywmmoP1GIR1KgbQ7YqcxF49cCO4Kg6QCZC9KUuP86hYsnrjsKH/exec',
    ).then((res) => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    });
}