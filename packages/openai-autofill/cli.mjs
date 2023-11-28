import { readFileSync } from 'fs';
// This code is for v4 of the openai package: npmjs.com/package/openai
import OpenAI from 'openai';
export const openai = new OpenAI({
    apiKey: readFileSync('./openai-apikey', 'utf-8'),
});
