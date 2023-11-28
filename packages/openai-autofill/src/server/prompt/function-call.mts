import type { LearningOutcome, ProvidedGeneratedData } from '@moodlenet/core-domain/resource'
import { stdEdResourceMachine } from '@moodlenet/ed-resource/server'
import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import type {
  ChatCompletionCreateParams,
  ChatCompletionMessageParam,
} from 'openai/resources/index.mjs'
import openai from '../openai-client.mjs'
import { shell } from '../shell.mjs'
import { extractResourceText } from '../text-extracion/extractResourceText.mjs'
import { systemMessagesJsonl } from './create-jsonl-array.mjs'
import bloomsCognitivesFineTuning from './meta-data/bloomsCognitivesFineTuning.mjs'
import iscedFields4CharsFineTuning from './meta-data/iscedFields4CharsFineTuning.mjs'
import iscedGradesFineTuning from './meta-data/iscedGradesFineTuning.mjs'
import langFineTuning from './meta-data/langFineTuning.mjs'
import resTypeFineTuning from './meta-data/resTypeFineTuning.mjs'
import type { ClassifyPars } from './types.mjs'
import { bcAttr, FN_NAME, par } from './types.mjs'

export async function enqueueMetaGeneration(resourceKey: string) {
  setTimeout(() => {
    generateMetaNow(resourceKey)
  }, 5000)
}
export async function generateMetaNow(resourceKey: string) {
  shell.initiateCall(async () => {
    setPkgCurrentUser()
    const [interpreter] = await stdEdResourceMachine({ by: 'key', key: resourceKey })
    const snap = interpreter.getSnapshot()
    if (!snap.can({ type: 'generated-meta-suggestions', generatedData: { meta: {} } })) {
      console.log(`!snap.can({ type: 'generated-meta-suggestions', generatedData: { meta: {} } })`)
      interpreter.stop()
      return
    }
    const textResource = await extractResourceText(snap.context.doc)

    const prompt: ChatCompletionMessageParam = {
      role: `user`,
      content: `
  this educational resource is a link to a youtube video
  the extracted text of the video is:

  ${textResource}`,
      // content: `
      // this educational resource is an uploaded file with ".pdf" extension
      // the extracted text of the resource is:

      // ${textResource}`,
    }
    const classifyResourceFn: ChatCompletionCreateParams.Function = {
      name: FN_NAME,
      description:
        'categorize an educational resource, using specific codes for various classifications (all "*Code" attribues and parameters), the most suitable language for the resource scope (for "resourceTitle","resourceSummary","bloomsCognitive.learningOutcomeDescription") ',
      parameters: {
        type: 'object',
        properties: {
          [par('resourceTitle')]: {
            type: 'string',
            minLength: 8,
            maxLength: 160,
            description: `A short title for this resource, using the most suitable language`,
          },
          [par('resourceSummary')]: {
            type: 'string',
            minLength: 30,
            maxLength: 4000,
            description: `A brief summary of this resource, using the most suitable language`,
          },
          [par('iscedFieldCode')]: {
            type: 'string',
            description: 'the most suitable isced-field code for this resource',
            enum: iscedFields4CharsFineTuning.data.map(([, code]) => code),
          },
          [par('iscedGradeCode')]: {
            type: 'string',
            description: 'the most suitable isced-grade code for this resource',
            enum: iscedGradesFineTuning.data.map(([, code]) => code),
          },
          [par('resourceTypeCode')]: {
            type: 'string',
            description: 'the most suitable resource-type code for this resource scope',
            enum: resTypeFineTuning.data.map(([, code]) => code),
          },
          [par('languageCode')]: {
            type: 'string',
            description: 'the most suitable resource languageCode-code for this resource scope',
            enum: langFineTuning.data.map(([, code]) => code),
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
                  enum: bloomsCognitivesFineTuning.data.map(([, , levelCode]) => levelCode),
                },
                [bcAttr('learningOutcomeVerbCode')]: {
                  type: 'string',
                  description: `One of the associated verb for the selected "bloomsLevelCode", acts as the first word for the "learningOutcomeDescription"`,
                  // enum: [
                  //   ...new Set(
                  //     bloomsCognitivesFineTuning.data
                  //       .map(([, verbCode]) => verbCode)
                  //       .flat()
                  //   ),
                  // ],
                },
                [bcAttr('learningOutcomeDescription')]: {
                  type: 'string',
                  description: `a one-liner learning outcome - it implicitly starts (and NOT include) with the selected "learningOutcomeVerbCode"`,
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

    const resp = await openai.chat.completions.create({
      // model: 'gpt-3.4',
      // model: 'gpt-3.5-turbo-0613',
      model: 'gpt-3.5-turbo-16k',
      // model: 'ft:gpt-3.5-turbo-0613:moodle::8DWOHiXi',

      temperature: 0.016,
      messages: [...systemMessagesJsonl.messages, /*  ...examples, */ prompt],
      functions: [classifyResourceFn],
      function_call: { name: FN_NAME },
    })

    const data: Partial<ClassifyPars> = JSON.parse(
      resp.choices[0]?.message.function_call?.arguments ?? '{}',
    )

    const generatedData: ProvidedGeneratedData = {
      meta: {
        description: data.resourceSummary,
        title: data.resourceTitle,
        learningOutcomes: (data.bloomsCognitive ?? []).map<LearningOutcome>(
          ({ learningOutcomeDescription, bloomsLevelCode, learningOutcomeVerbCode }) => ({
            sentence: `${learningOutcomeVerbCode} ${learningOutcomeDescription}`,
            value: {
              code: bloomsLevelCode,
              sentence: learningOutcomeDescription,
              verb: learningOutcomeVerbCode,
            },
          }),
        ),
        language: data.languageCode ? { code: data.languageCode } : null,
        level: data.iscedGradeCode ? { code: data.iscedGradeCode } : null,
        subject: data.iscedFieldCode ? { code: data.iscedFieldCode } : null,
        type: data.resourceTypeCode ? { code: data.resourceTypeCode } : null,
      },
    }
    interpreter.send({ type: 'generated-meta-suggestions', generatedData })
    interpreter.stop()
  })
}
