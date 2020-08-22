/* eslint-disable @typescript-eslint/no-unused-vars */
import { Document, Model } from 'mongoose';
import { IProjectListener } from '../interfaces/IProjectListener';

declare global {
    namespace Models {
        export type ProjectListener = Model<IProjectListener & Document>;
    }
}
