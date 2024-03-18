import type { ResourceDoc } from '@moodlenet/core-domain/resource'
import domain from 'domain'
import type {
  ChatCompletion,
  ChatCompletionCreateParams,
  ChatCompletionMessageParam,
} from 'openai/resources/index.mjs'
import { env } from '../init/env.mjs'
import openAiClient from '../openai-client.mjs'
import { extractResourceData } from '../resource-extract/extractResourceText.mjs'
import type { ResourceExtraction } from '../resource-extract/types.mjs'
import { urlToRpcFile } from '../resource-extract/util.mjs'
import { shell } from '../shell.mjs'
import getPromptsAndData from './get-prompts-and-data.mjs'
import type { BloomsCognitiveElem, ClassifyPars } from './types.mjs'
import { FN_NAME, bcAttr, par } from './types.mjs'

interface OpenAiResponse {
  data: null | Partial<ClassifyPars>
  resourceExtraction: ResourceExtraction
}

export async function callOpenAI(doc: ResourceDoc): Promise<OpenAiResponse | null> {
  const d = domain.create()
  d.on('error', err => {
    shell.log('error', 'TEXT EXTRACTION OR OPEN AI CALL ERROR ! caught by DOMAIN Aborting', err)
  })
  const resourceExtraction = await d.run(() =>
    extractResourceData(doc).catch(err => {
      shell.log('warn', 'resourceExtraction err', err)
      return null
    }),
  )
  if (!resourceExtraction) {
    return null
  }

  const { contentDesc, content, title, type, provideImage } = resourceExtraction
  shell.log('notice', 'calling openai for', { contentDesc, type })

  const { completionConfig, prompts } = await getCompletionConfigs()
  const resp = await openAiClient.chat.completions.create(completionConfig).catch(err => {
    shell.log('warn', 'openai chat completions call failed', err)
    return null
  })
  if (!resp) {
    return null
  }

  // console.log({ promptL: prompt.content?.length,  messagesL: prompts.systemMessagesJsonl.messages.reduce((_, { content }) => {     return _ + (content?.length ?? 0) }, 0), tokens: resp.usage, })
  const cleaneupCompletions = cleanupChatCompletion(resp)
  if (!cleaneupCompletions) {
    return { data: null, resourceExtraction }
  }
  const {
    data,
    foundIscedFieldDesc,
    foundIscedGradeDesc,
    // foundLanguageDesc,
    // foundResourceTypeDesc,
  } = cleaneupCompletions
  // type: ${foundResourceTypeDesc ? `of type "${foundResourceTypeDesc}"` : ''}

  const openAiProvideImage = provideImage ?? (await generateProvideImage())
  d.exit()
  return {
    data,
    resourceExtraction: {
      contentDesc,
      content,
      title,
      type,
      provideImage: openAiProvideImage ?? provideImage,
    },
  }

  function cleanupChatCompletion(chatCompletion: ChatCompletion) {
    const data = (() => {
      const argsString = chatCompletion.choices[0]?.message.function_call?.arguments ?? '{}'
      try {
        return JSON.parse(argsString) as Partial<ClassifyPars>
      } catch {
        shell.log(
          'warn',
          'chatCompletion arguments unparseable',
          argsString,
          'finish_reason',
          chatCompletion.choices[0]?.finish_reason,
        )
        return null
      }
    })()
    if (!data) {
      return null
    }
    // writeFile('_.json', JSON.stringify({ textResource, data, messages, classifyResourceFn }, null, 2))
    data.bloomsCognitive = data.bloomsCognitive
      ?.map(generatedBloom => {
        const bloomDef = prompts.bloomsCognitivesFineTuning.data.find(
          ([, verbs, levelCode]) =>
            levelCode === generatedBloom.bloomsLevelCode &&
            verbs.includes(generatedBloom.learningOutcomeVerbCode),
        )
        const sanitizedGeneratedBloom: BloomsCognitiveElem = { ...generatedBloom }
        if (bloomDef) {
          // const [name, verbs, code] = bloomDef
          const [, verbs] = bloomDef
          const verbNail = new RegExp(`^(${verbs.join('|')})`)
          sanitizedGeneratedBloom.learningOutcomeDescription =
            generatedBloom.learningOutcomeDescription.trim().replace(verbNail, '').trim()
        }
        return { sanitizedGeneratedBloom, bloomDef }
      })
      .filter(({ bloomDef }) => !!bloomDef)
      .map(({ sanitizedGeneratedBloom }) => sanitizedGeneratedBloom)

    const [foundIscedFieldDesc, foundIscedFieldCode] =
      prompts.iscedFields4CharsFineTuning.data.find(([, code]) => code === data.iscedFieldCode) ?? [
        undefined,
        undefined,
      ]

    const [foundIscedGradeDesc, foundIscedGradeCode] = prompts.iscedGradesFineTuning.data.find(
      ([, code]) => code === data.iscedGradeCode,
    ) ?? [undefined, undefined]

    const [foundLanguageDesc, foundLanguageCode] = prompts.langFineTuning.data.find(
      ([, code]) => code === data.languageCode,
    ) ?? [undefined, undefined]

    const [foundResourceTypeDesc, foundResourceTypeCode] = prompts.resTypeFineTuning.data.find(
      ([, code]) => code === data.resourceTypeCode,
    ) ?? [undefined, undefined]

    data.iscedFieldCode = foundIscedFieldCode
    data.iscedGradeCode = foundIscedGradeCode
    data.languageCode = foundLanguageCode
    data.resourceTypeCode = foundResourceTypeCode

    return {
      data,
      foundIscedFieldDesc,
      foundIscedGradeDesc,
      foundLanguageDesc,
      foundResourceTypeDesc,
    }
  }

  async function generateProvideImage() {
    const imagePrompt = `Create a complete uncut image, for an online educational resource described as follows:
      ${data.resourceTitle ? `# "${data.resourceTitle.toUpperCase()}"` : ''}
      ${foundIscedFieldDesc ? `about "${foundIscedFieldDesc}" subject ` : ''} ${
      foundIscedGradeDesc ? `for students of "${foundIscedGradeDesc}" grade` : ''
    }
      
      ${data.resourceSummary ? `"${data.resourceSummary}"` : ''}
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
      Note: Please ensure there is no text, writing, or any form of lettering included in the image
      `
    const imageGenResp = await openAiClient.images
      .generate({
        model: 'dall-e-3',
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024',
        style: 'natural',
      })
      .catch(err => {
        shell.log('warn', 'openai dall-e-3 call failed', err)
        return undefined
      })
    // console.log(imageGenResp)
    const imageUrl = imageGenResp?.data[0]?.url
    if (!imageUrl) {
      return undefined
    }

    const imageRpcFile = await urlToRpcFile(imageUrl)

    return imageRpcFile
  }

  async function getCompletionConfigs() {
    const cutText = [title ?? '', content ?? ''].join('\n').slice(0, env.cutContentToCharsAmount)

    const prompts = await getPromptsAndData()
    const prompt: ChatCompletionMessageParam = {
      role: `user`,
      content: `please categorize this ${type} educational resource with the following ${contentDesc} content,

${cutText}
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
                      prompts.bloomsCognitivesFineTuning.data
                        .map(([, verbCode]) => verbCode)
                        .flat(),
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

    const completionConfig = {
      model: 'gpt-3.5-turbo-16k',
      temperature: 0.0,
      messages,
      functions: [classifyResourceFn],
      function_call: { name: FN_NAME },
    }
    return { completionConfig, prompts }
  }
}
