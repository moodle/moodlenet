import type { EntityCollectionDef } from '@moodlenet/system-entities/server'
import { registerAccessController, registerEntities } from '@moodlenet/system-entities/server'
import type { EdMetaEntityNames } from '../../common/types.mjs'
import { shell } from '../shell.mjs'
import type {
  EdAssetTypeDataType,
  IscedFieldDataType,
  IscedGradeDataType,
  LanguageDataType,
  LicenseDataType,
} from '../types.mjs'

export const { IscedField, IscedGrade, Language, EdAssetType, License } = await shell.call(
  registerEntities,
)<
  {
    IscedField: EntityCollectionDef<IscedFieldDataType>
    IscedGrade: EntityCollectionDef<IscedGradeDataType>
    Language: EntityCollectionDef<LanguageDataType>
    EdAssetType: EntityCollectionDef<EdAssetTypeDataType>
    License: EntityCollectionDef<LicenseDataType>
  },
  EdMetaEntityNames
>({
  IscedField: {},
  IscedGrade: {},
  Language: {},
  EdAssetType: {},
  License: {},
})

await shell.call(registerAccessController)({
  u() {
    return null
  },
  r(/* { myPkgMeta } */) {
    return true //`${isCurrentOfEntityClass2Aql(IscedField.entityClass)} || null` // && ${myPkgMeta}.xx == null`
  },
  c(/* entityClass */) {
    return null
  },
})
