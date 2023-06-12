import fetch from 'node-fetch';
import config from '../config';
import { IProjectRequest } from '../interfaces/IProjectRequest';

// TODO: Add types

export async function fetchSheets() : Promise<Object> {
    return fetch(config.sheets).then((res) => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    });
}