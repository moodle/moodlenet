export type eduBloomCognitiveLevel = '1' | '2' | '3' | '4' | '5' | '6'
export type eduBloomCognitiveRecord = {
  id: eduBloomCognitiveLevel
  description: string
  verbs: string[]
}

export type eduIscedFieldId = string
export type eduIscedFieldRecord = { description: string; id: eduIscedFieldId; codePath: eduIscedFieldPath }
type eduIscedFieldPath = [string] | [string, string] | [string, string, string]

export type eduIscedLevelId = string
export type eduIscedLevelRecord = { description: string; id: eduIscedLevelId; codePath: eduIscedLevelPath }
type eduIscedLevelPath = [string] | [string, string] | [string, string, string]

export type eduResourceTypeId = string
export type eduResourceTypeRecord = { description: string; id: eduResourceTypeId }
