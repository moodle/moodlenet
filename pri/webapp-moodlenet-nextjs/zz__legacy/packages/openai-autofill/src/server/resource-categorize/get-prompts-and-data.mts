import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import getBloomsCognitivesFineTuning from './meta-data/bloomsCognitivesFineTuning.mjs'
import getIscedFields4CharsFineTuning from './meta-data/iscedFields4CharsFineTuning.mjs'
import getIscedGradesFineTuning from './meta-data/iscedGradesFineTuning.mjs'
import getLangFineTuning from './meta-data/langFineTuning.mjs'
import getLicenseFineTuning from './meta-data/licenseFineTuning.mjs'
import getResTypeFineTuning from './meta-data/resTypeFineTuning.mjs'
import { FN_NAME } from './types.mjs'
export default async function () {
  const [
    iscedFields4CharsFineTuning,
    iscedGradesFineTuning,
    resTypeFineTuning,
    langFineTuning,
    licenseFineTuning,
    bloomsCognitivesFineTuning,
  ] = await Promise.all([
    getIscedFields4CharsFineTuning(),
    getIscedGradesFineTuning(),
    getResTypeFineTuning(),
    getLangFineTuning(),
    getLicenseFineTuning(),
    getBloomsCognitivesFineTuning(),
  ])

  const systemMsgStrings: string[] = [
    `you are an assistant specialized in categorizing educational resources`,
    `you, as an assistant, won't ever interact directly with humans, instead you will be interacting with a computer program, via function calling`,
    `you will be given a text extracted from an educational resource, 
  your task is to analize the resource based on its content and features
  you will attempt to infer a short meaningful "title" and a brief meaningful "summary" for the resource
  moreover you will categorize the resource using the following instructions and code-mappings`,
    ...iscedFields4CharsFineTuning.openaiSystem,
    ...iscedGradesFineTuning.openaiSystem,
    ...resTypeFineTuning.openaiSystem,
    ...langFineTuning.openaiSystem,
    ...licenseFineTuning.openaiSystem,
    ...bloomsCognitivesFineTuning.openaiSystem,
  ]

  const systemMessagesJsonl = {
    messages: systemMsgStrings
      .map<ChatCompletionMessageParam>(content => ({
        role: 'system',
        content,
      }))
      .concat([
        {
          role: 'assistant',
          content: `when I will be prompted to classify a resource I will always and exclusively call the function "${FN_NAME}" passing proper parameters for categorizing the resource`,
        },
      ]),
  }
  return {
    iscedFields4CharsFineTuning,
    iscedGradesFineTuning,
    resTypeFineTuning,
    langFineTuning,
    licenseFineTuning,
    bloomsCognitivesFineTuning,
    systemMessagesJsonl,
  }
}
