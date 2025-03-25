import { i_nat } from '@moodle/lib-types'

export type bloomCognitiveLevel = i_nat
export type bloomCognitive = {
  level: bloomCognitiveLevel
  description: string
  verbs: string[]
}

export type iscedFieldCode = string
export type iscedField = {
  code: iscedFieldCode
  description: string
  codePath: iscedFieldPath
}
type iscedFieldPath = [string] | [string, string] | [string, string, string]

export type iscedLevelCode = string
export type iscedLevel = {
  code: iscedLevelCode
  description: string
  codePath: iscedLevelPath
}
type iscedLevelPath = [string] | [string, string] | [string, string, string]

export type resourceTypeCode = string
export type resourceType = {
  code: resourceTypeCode
  description: string
}
