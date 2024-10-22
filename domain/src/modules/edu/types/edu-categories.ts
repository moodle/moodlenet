import { positive_integer, url_string } from '@moodle/lib-types'

export type bloomCognitiveLevel = 1 | 2 | 3 | 4 | 5 | 6
export type bloomCognitive = {
  id: bloomCognitiveLevel
  desc: string
  verbs: string[]
}

export type iscedFieldId = string
export type iscedField = { desc: string; id: iscedFieldId; subjectPath: [string, string, string]; url: url_string }

export type iscedLevelId = positive_integer
export type iscedLevel = { desc: string; id: iscedLevelId }

export type eduResourceTypeId = string
export type eduResourceType = { desc: string; id: eduResourceTypeId }


