import OpenAI from 'openai'
import { env } from './init/env'

const openAiClient = new OpenAI({
  apiKey: env.apiKey,
})

export default openAiClient
