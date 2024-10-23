import { positive_integer, url_string } from '@moodle/lib-types'

export type bloomCognitiveLevel = 1 | 2 | 3 | 4 | 5 | 6
export type bloomCognitive = {
  id: bloomCognitiveLevel
  desc: string
  verbs: string[]
}

export type iscedFieldId = string
export type iscedField = { description: string; id: iscedFieldId; codePath: [string, string?, string?] }

export type iscedLevelId = string
export type iscedLevel = { description: string; id: iscedLevelId; codePath: [string, string?, string?] }

export type eduResourceTypeId = string
export type eduResourceType = { description: string; id: eduResourceTypeId }


