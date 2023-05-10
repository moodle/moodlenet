import type { EntityCollectionDef } from '@moodlenet/system-entities/server'
import { registerEntities } from '@moodlenet/system-entities/server'
import type { EdMetaEntityNames } from '../common/types.mjs'
import { shell } from './shell.mjs'
import type { IscedFieldDataType, IscedGradeDataType } from './types.mjs'

export const { IscedField, IscedGrade } = await shell.call(registerEntities)<
  {
    IscedField: EntityCollectionDef<IscedFieldDataType>
    IscedGrade: EntityCollectionDef<IscedGradeDataType>
  },
  EdMetaEntityNames
>({
  IscedField: {},
  IscedGrade: {},
})
// export const { IscedField } = await shell.call(registerEntities)<{
//   IscedField: EntityCollectionDef<IscedFieldDataType>
// }>({
//   IscedField: {},
// })
// export const { IscedGrade } = await shell.call(registerEntities)<{
//   IscedGrade: EntityCollectionDef<IscedGradeDataType>
// }>({
//   IscedGrade: {},
// })

console.log({ IscedField, IscedGrade })
