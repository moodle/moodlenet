import type { EntityDocument } from '@moodlenet/system-entities/server'

export type IscedFieldEntityDoc = EntityDocument<IscedFieldDataType>
export type IscedFieldDataType = {
  codePath: string[]
  name: string
  published: boolean
}

export type IscedGradeEntityDoc = EntityDocument<IscedGradeDataType>
export type IscedGradeDataType = {
  codePath: string[]
  name: string
  published: boolean
}
