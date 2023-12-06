import type {
  ChatCompletionCreateParams,
  ChatCompletionMessageParam,
} from 'openai/resources/index.mjs'
import openAiClient from '../openai-client.mjs'
import getPromptsAndData from './get-prompts-and-data.mjs'
import type { ClassifyPars } from './types.mjs'
import { bcAttr, FN_NAME, par } from './types.mjs'

export async function callOpenAI(textResource: string, opts: { noImageUrl: boolean }) {
  const prompts = await getPromptsAndData()
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

  const resp = await openAiClient.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    temperature: 0.0,
    messages,
    functions: [classifyResourceFn],
    function_call: { name: FN_NAME },
  })
  // console.log({ promptL: prompt.content?.length,  messagesL: prompts.systemMessagesJsonl.messages.reduce((_, { content }) => {     return _ + (content?.length ?? 0) }, 0), tokens: resp.usage, })
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

  const [foundIscedFieldDesc, foundIscedFieldCode] = prompts.iscedFields4CharsFineTuning.data.find(
    ([, code]) => code === data.iscedFieldCode,
  ) ?? [undefined, undefined]

  const [foundIscedGradeDesc, foundIscedGradeCode] = prompts.iscedGradesFineTuning.data.find(
    ([, code]) => code === data.iscedGradeCode,
  ) ?? [undefined, undefined]

  const [, /* foundLanguageDesc */ foundLanguageCode] = prompts.langFineTuning.data.find(
    ([, code]) => code === data.languageCode,
  ) ?? [undefined, undefined]

  const [foundResourceTypeDesc, foundResourceTypeCode] = prompts.resTypeFineTuning.data.find(
    ([, code]) => code === data.resourceTypeCode,
  ) ?? [undefined, undefined]

  data.iscedFieldCode = foundIscedFieldCode
  data.iscedGradeCode = foundIscedGradeCode
  data.languageCode = foundLanguageCode
  data.resourceTypeCode = foundResourceTypeCode

  const imageUrl = await (async () => {
    const imagePrompt = `A photorealistic illustration for an online educational resource:
${data.resourceTitle ? `"${data.resourceTitle}"` : ''}
${data.resourceSummary ? `"${data.resourceSummary}"` : ''}
${foundIscedFieldDesc ? `about "${foundIscedFieldDesc}" subject ` : ''}
${foundIscedGradeDesc ? `for students of "${foundIscedGradeDesc}" grade` : ''}
${foundResourceTypeDesc ? `of type "${foundResourceTypeDesc}"` : ''}
${
  data.bloomsCognitive?.length
    ? `with learning outcomes:
  ${data.bloomsCognitive
    .map(
      ({ learningOutcomeVerbCode, learningOutcomeDescription }) =>
        `${learningOutcomeVerbCode} ${learningOutcomeDescription}`,
    )
    .join('\n')}`
    : ''
}
DO NOT EVER RENDER ANY TEXT !
`
    return opts.noImageUrl
      ? undefined
      : await (async () => {
          const imageGenResp = await openAiClient.images.generate({
            model: 'dall-e-3',
            prompt: imagePrompt,
            n: 1,
            size: '1024x1024',
            style: 'natural',
          })
          // console.log(imageGenResp)
          return imageGenResp.data[0]?.url
        })()
  })()

  return { data, imageUrl }
}
