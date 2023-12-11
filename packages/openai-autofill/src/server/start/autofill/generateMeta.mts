import type {
  LearningOutcome,
  ProvidedGeneratedData,
  ResourceDoc,
} from '@moodlenet/core-domain/resource'
import { extractResourceData } from '../../extract-text/extractResourceText.mjs'
import { callOpenAI } from '../../prompt/function-call.mjs'
import type { ClassifyPars } from '../../prompt/types.mjs'
import { shell } from '../../shell.mjs'

export async function generateMeta(doc: ResourceDoc) {
  const resourceTextAndDesc = await extractResourceData(doc)

  const { data, imageUrl } = resourceTextAndDesc
    ? await callOpenAI(resourceTextAndDesc, { noImageUrl: !!doc.image }).catch(err => {
        shell.log('warn', 'openai call failed', err)
        const data: Partial<ClassifyPars> = {}
        return {
          data,
          imageUrl: undefined,
        }
      })
    : {
        data: {},
        imageUrl: undefined,
      }

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
    // image: imageUrl ? { url: imageUrl } : null,
  }
  return {
    generatedData,
    imageUrl,
  }
}
