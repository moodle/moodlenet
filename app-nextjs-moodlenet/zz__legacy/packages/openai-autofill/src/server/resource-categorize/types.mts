export interface ClassifyPars {
  resourceTitle: string
  resourceSummary: string
  resourceTypeCode: string
  iscedGradeCode: string
  ccLicense: string
  creationYear: number
  creationMonth: number
  languageCode: string
  iscedFieldCode: string
  bloomsCognitive: BloomsCognitiveElem[]
}
export interface BloomsCognitiveElem {
  bloomsLevelCode: string
  learningOutcomeVerbCode: string
  learningOutcomeDescription: string
}

export const FN_NAME = 'classifyResource'

export function par(_: keyof ClassifyPars) {
  return _
}
export function bcAttr(_: keyof BloomsCognitiveElem) {
  return _
}

export const JSONL_FILENAME = 'moodlenet-fine-tuning-file.jsonl'
