import type { RpcFile } from '@moodlenet/core'
import type {
  LearningOutcome,
  ProvidedGeneratedData,
  ResourceDoc,
} from '@moodlenet/core-domain/resource'
import { callOpenAI } from '../../resource-categorize/open-ai-call.mjs'

export async function generateMeta(doc: ResourceDoc): Promise<null | {
  generatedData: ProvidedGeneratedData
  provideImage: RpcFile | undefined
}> {
  const openAiResponse = await callOpenAI(doc)
  if (!openAiResponse) {
    return null
  }
  if (!openAiResponse.data) {
    return {
      generatedData: {
        meta: {
          description: openAiResponse.resourceExtraction.content?.substring(0, 300),
          title: openAiResponse.resourceExtraction.title?.substring(0, 60),
          learningOutcomes: [],
          language: null,
          level: null,
          subject: null,
          type: null,
        },
      },
      provideImage: openAiResponse.resourceExtraction.provideImage,
    }
  }

  const generatedData: ProvidedGeneratedData = {
    meta: {
      description: openAiResponse.data.resourceSummary,
      title: openAiResponse.data.resourceTitle,
      learningOutcomes: (openAiResponse.data.bloomsCognitive ?? []).map<LearningOutcome>(
        ({ learningOutcomeDescription, bloomsLevelCode, learningOutcomeVerbCode }) => ({
          sentence: `${learningOutcomeVerbCode} ${learningOutcomeDescription}`,
          value: {
            code: bloomsLevelCode,
            sentence: learningOutcomeDescription,
            verb: learningOutcomeVerbCode,
          },
        }),
      ),
      license: openAiResponse.data.ccLicense ? { code: openAiResponse.data.ccLicense } : null,
      originalPublicationInfo:
        openAiResponse.data.creationYear && openAiResponse.data.creationMonth
          ? {
              year: Number(openAiResponse.data.creationYear),
              month: Number(openAiResponse.data.creationMonth),
            }
          : null,
      language: openAiResponse.data.languageCode
        ? { code: openAiResponse.data.languageCode }
        : null,
      level: openAiResponse.data.iscedGradeCode
        ? { code: openAiResponse.data.iscedGradeCode }
        : null,
      subject: openAiResponse.data.iscedFieldCode
        ? { code: openAiResponse.data.iscedFieldCode }
        : null,
      type: openAiResponse.data.resourceTypeCode
        ? { code: openAiResponse.data.resourceTypeCode }
        : null,
    },
  }

  return {
    generatedData,
    provideImage: doc.image ? undefined : openAiResponse.resourceExtraction.provideImage,
  }
}
