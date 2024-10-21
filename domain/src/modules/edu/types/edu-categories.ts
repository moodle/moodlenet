import { positive_integer, url_string } from '@moodle/lib-types'

export type bloomCognitiveLevel = positive_integer
export type bloomCognitive = {
  level: bloomCognitiveLevel
  verb: string
  learningOutcome: string
}

export type isced_field_id = string
export type iscedField = { desc: string; id: isced_field_id; subjectPath: [string, string, string]; url: url_string }

export type isced_level_id = positive_integer
export type iscedLevel = { desc: string; id: isced_level_id }
