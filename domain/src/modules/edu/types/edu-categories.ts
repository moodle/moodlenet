export type eduBloomCognitiveLevel = '1' | '2' | '3' | '4' | '5' | '6'
export type eduBloomCognitiveRecord = {
  id: eduBloomCognitiveLevel
  description: string
  verbs: string[]
}

export type eduIscedFieldCode = string
export type eduIscedFieldRecord = {
  id: eduIscedFieldCode
  enabled: boolean
  description: string
  codePath: eduIscedFieldPath
}
type eduIscedFieldPath = [string] | [string, string] | [string, string, string]

export type eduIscedLevelCode = string
export type eduIscedLevelRecord = {
  id: eduIscedLevelCode
  enabled: boolean
  description: string
  codePath: eduIscedLevelPath
}
type eduIscedLevelPath = [string] | [string, string] | [string, string, string]

export type eduResourceTypeCode = string
export type eduResourceTypeRecord = { enabled: boolean; description: string; id: eduResourceTypeCode }
