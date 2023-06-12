import axios from 'axios';
import { IProjectRequest } from '../interfaces/IProjectRequest';

// TODO: Add types

export async function fetchSheets() : Promise<any[]> {
    axios
        .get(
            'https://script.google.com/macros/s/AKfycbwcAfxr9ckEWDhVhdPgRSefTPaTyvOwOXluO1wzYnw3kCOYCpyqmb1qBS2KRgt1HxZk/exec',
        )
        .then((res) => {
            return res.data.data as IProjectRequest[];
        })
        .catch((err) => {
            return ['error'];
        });
    return [];
}