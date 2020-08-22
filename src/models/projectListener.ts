import { Schema, model } from 'mongoose';

const ProjectListener = new Schema({
    lineid: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String, default: null },
});

export default model('projectListener', ProjectListener);
