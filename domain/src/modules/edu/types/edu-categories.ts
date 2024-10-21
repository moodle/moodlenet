import { positive_integer, url_string } from '@moodle/lib-types'

export type bloomCognitiveLevel = positive_integer
export type bloomCognitive = {
  level: bloomCognitiveLevel
  verb: string
  learningOutcome: string
}

export type iscedField = string
export type iscedFieldMeta = { desc: string; field: iscedField; subjectPath: [string, string, string]; url: url_string }

export type iscedLevel = positive_integer
export type iscedLevelMeta = { desc: string; level: iscedLevel }
