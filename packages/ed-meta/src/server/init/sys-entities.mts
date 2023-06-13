import type { EntityCollectionDef } from '@moodlenet/system-entities/server'
import { registerEntities } from '@moodlenet/system-entities/server'
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
