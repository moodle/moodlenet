import OpenAI from 'openai'
import { env } from './init/env.mjs'

const openAiClient = new OpenAI({
  apiKey: env.apiKey,
})

export default openAiClient
