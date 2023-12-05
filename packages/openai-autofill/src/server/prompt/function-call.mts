import type {
  ChatCompletionCreateParams,
  ChatCompletionMessageParam,
} from 'openai/resources/index.mjs'
import openai from '../openai-client.mjs'
import getPrompts from './prompts.mjs'
import type { ClassifyPars } from './types.mjs'
import { bcAttr, FN_NAME, par } from './types.mjs'

export async function callOpeAI(textResource: string) {
  const prompts = await getPrompts()
  const prompt: ChatCompletionMessageParam = {
    role: `user`,
    content: `categorize the following educational resource:

${textResource}
`,
  }
  const classifyResourceFn: ChatCompletionCreateParams.Function = {
    name: FN_NAME,
    description: `categorize an educational resource, using specific codes for encoded classifications parameters (all "*Code" attribues and parameters), 
and the most suitable natural language for descriptive parameters ("${par(
      'resourceTitle',
    )}", "${par('resourceSummary')}", "${par('bloomsCognitive')}.${bcAttr(
      'learningOutcomeDescription',
    )}") `,
    parameters: {
      type: 'object',
      properties: {
        [par('resourceTitle')]: {
          type: 'string',
          minLength: 8,
          maxLength: 160,
          description: `A short meaningful title for this resource, using the most suitable language`,
        },
        [par('resourceSummary')]: {
          type: 'string',
          minLength: 30,
          maxLength: 4000,
          description: `A brief meaningful summary of this resource, using the most suitable language`,
        },
        [par('iscedFieldCode')]: {
          type: 'string',
          description: 'the most suitable isced-field code for this resource',
          enum: prompts.iscedFields4CharsFineTuning.data.map(([, code]) => code),
        },
        [par('iscedGradeCode')]: {
          type: 'string',
          description: 'the most suitable isced-grade code for this resource',
          enum: prompts.iscedGradesFineTuning.data.map(([, code]) => code),
        },
        [par('resourceTypeCode')]: {
          type: 'string',
          description: 'the most suitable resource-type code for this resource scope',
          enum: prompts.resTypeFineTuning.data.map(([, code]) => code),
        },
        [par('languageCode')]: {
          type: 'string',
          description: 'the most suitable resource language code for this resource scope',
          enum: prompts.langFineTuning.data.map(([, code]) => code),
        },
        [par('bloomsCognitive')]: {
          type: 'array',
          description: 'a set of learning outcomes for this resource',
          minItems: 1,
          maxItems: 5,
          items: {
            type: 'object',
            description: 'an object describing one learning outcome for this resource',
            properties: {
              [bcAttr('bloomsLevelCode')]: {
                type: 'string',
                description: 'the "Blooms Cognitive Taxonomy Level" code',
                enum: prompts.bloomsCognitivesFineTuning.data.map(([, , levelCode]) => levelCode),
              },
              [bcAttr('learningOutcomeVerbCode')]: {
                type: 'string',
                description: `One of the associated verb for the selected ${bcAttr(
                  'bloomsLevelCode',
                )}, acts as the first word for the ${bcAttr('learningOutcomeDescription')}`,
                enum: [
                  ...new Set(
                    prompts.bloomsCognitivesFineTuning.data.map(([, verbCode]) => verbCode).flat(),
                  ),
                ],
              },
              [bcAttr('learningOutcomeDescription')]: {
                type: 'string',
                description: `a one-liner learning outcome - it implicitly starts (and NOT include) with the selected ${bcAttr(
                  'learningOutcomeVerbCode',
                )}`,
                minLength: 8,
                maxLength: 160,
              },
            },
            required: [
              bcAttr('bloomsLevelCode'),
              bcAttr('learningOutcomeVerbCode'),
              bcAttr('learningOutcomeDescription'),
            ],
            additionalProperties: false,
          },
        },
      },
      required: [
        par('resourceTitle'),
        par('resourceSummary'),
        par('iscedFieldCode'),
        par('iscedGradeCode'),
        par('resourceTypeCode'),
        par('languageCode'),
        par('bloomsCognitive'),
      ],
      additionalProperties: false,
    },
  }

  const messages = [...prompts.systemMessagesJsonl.messages, /*  ...examples, */ prompt]

  const resp = await openai.chat.completions.create({
    // model: 'gpt-3.4',
    // model: 'gpt-3.5-turbo-0613',
    model: 'gpt-3.5-turbo-16k',
    // model: 'ft:gpt-3.5-turbo-0613:moodle::8DWOHiXi',
    temperature: 0.0,
    messages,
    functions: [classifyResourceFn],
    function_call: { name: FN_NAME },
  })
  console.log({
    promptL: prompt.content?.length,
    messagesL: prompts.systemMessagesJsonl.messages.reduce((_, { content }) => {
      return _ + (content?.length ?? 0)
    }, 0),
    tokens: resp.usage,
  })
  const data: Partial<ClassifyPars> = JSON.parse(
    resp.choices[0]?.message.function_call?.arguments ?? '{}',
  )
  // writeFile('_.json', JSON.stringify({ textResource, data, messages, classifyResourceFn }, null, 2))
  data.bloomsCognitive = data.bloomsCognitive?.filter(
    ({ bloomsLevelCode, learningOutcomeVerbCode }) =>
      !!prompts.bloomsCognitivesFineTuning.data.find(
        ([, verbs, levelCode]) =>
          levelCode === bloomsLevelCode && verbs.includes(learningOutcomeVerbCode),
      ),
  )

  data.iscedFieldCode = prompts.iscedFields4CharsFineTuning.data
    .map(([, code]) => code)
    .find(code => code === data.iscedFieldCode)

  data.iscedGradeCode = prompts.iscedGradesFineTuning.data
    .map(([, code]) => code)
    .find(code => code === data.iscedGradeCode)

  data.languageCode = prompts.langFineTuning.data
    .map(([, code]) => code)
    .find(code => code === data.languageCode)

  data.resourceTypeCode = prompts.resTypeFineTuning.data
    .map(([, code]) => code)
    .find(code => code === data.resourceTypeCode)

  return data
}
