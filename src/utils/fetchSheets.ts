import axios, { AxiosResponse } from 'axios';
import { IProjectRequest } from '../interfaces/IProjectRequest';

// fetch project requests from google sheets
export async function fetchSheets(): Promise<IProjectRequest[]> {
    try {
        const response = await axios.get(
            'https://script.google.com/macros/s/AKfycbwcAfxr9ckEWDhVhdPgRSefTPaTyvOwOXluO1wzYnw3kCOYCpyqmb1qBS2KRgt1HxZk/exec',
        );
        const data: IProjectRequest[] = response.data.data;
        return data;
    } catch (error) {
        throw new Error('Failed to fetch data from the API.');
    }
}