export type eduBloomCognitiveLevel = string
export type eduBloomCognitive = {
  level: eduBloomCognitiveLevel
  description: string
  verbs: string[]
}

export type eduIscedFieldCode = string
export type eduIscedField = {
  code: eduIscedFieldCode
  description: string
  codePath: eduIscedFieldPath
}
type eduIscedFieldPath = [string] | [string, string] | [string, string, string]

export type eduIscedLevelCode = string
export type eduIscedLevel = {
  code: eduIscedLevelCode
  description: string
  codePath: eduIscedLevelPath
}
type eduIscedLevelPath = [string] | [string, string] | [string, string, string]

export type eduResourceTypeCode = string
export type eduResourceType = { description: string; code: eduResourceTypeCode }
