export type eduBloomCognitiveLevel = string
export type eduBloomCognitiveRecord = {
  level: eduBloomCognitiveLevel
  description: string
  verbs: string[]
}

export type eduIscedFieldCode = string
export type eduIscedFieldRecord = {
  code: eduIscedFieldCode
  description: string
  codePath: eduIscedFieldPath
}
type eduIscedFieldPath = [string] | [string, string] | [string, string, string]

export type eduIscedLevelCode = string
export type eduIscedLevelRecord = {
  code: eduIscedLevelCode
  description: string
  codePath: eduIscedLevelPath
}
type eduIscedLevelPath = [string] | [string, string] | [string, string, string]

export type eduResourceTypeCode = string
export type eduResourceTypeRecord = { description: string; code: eduResourceTypeCode }
