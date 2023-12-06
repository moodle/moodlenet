import type {
  LearningOutcome,
  ProvidedGeneratedData,
  ResourceDoc,
} from '@moodlenet/core-domain/resource'
import { extractResourceData } from '../../extract-text/extractResourceText.mjs'
import { env } from '../../init/env.mjs'
import { callOpenAI } from '../../prompt/function-call.mjs'

export async function generateMeta(doc: ResourceDoc) {
  const { text } = await extractResourceData(doc)

  const cutText = text.slice(0, env.cutContentToCharsAmount)
  const { data, imageUrl } = await callOpenAI(cutText, { noImageUrl: !!doc.image })

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
