export type eduBloomCognitiveLevel = '1' | '2' | '3' | '4' | '5' | '6'
export type eduBloomCognitiveRecord = {
  level: eduBloomCognitiveLevel
  description: string
  verbs: string[]
}

export type eduIscedFieldCode = string
export type eduIscedFieldRecord = {
  enabled: boolean
  description: string
  code: eduIscedFieldCode
  codePath: eduIscedFieldPath
}
type eduIscedFieldPath = [string] | [string, string] | [string, string, string]

export type eduIscedLevelCode = string
export type eduIscedLevelRecord = {
  enabled: boolean
  description: string
  code: eduIscedLevelCode
  codePath: eduIscedLevelPath
}
type eduIscedLevelPath = [string] | [string, string] | [string, string, string]

export type eduResourceTypeCode = string
export type eduResourceTypeRecord = { enabled: boolean; description: string; code: eduResourceTypeCode }
