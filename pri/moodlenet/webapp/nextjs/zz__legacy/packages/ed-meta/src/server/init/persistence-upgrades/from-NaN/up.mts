import { addTextSearchFields, create } from '@moodlenet/system-entities/server'
import { shell } from '../../../shell.mjs'
import type {
  EdAssetTypeDataType,
  IscedFieldDataType,
  IscedGradeDataType,
  LanguageDataType,
  LicenseDataType,
} from '../../../types.mjs'
import { EdAssetType, IscedField, IscedGrade, Language, License } from '../../sys-entities.mjs'
import EdMetaIscedFields from './raw/EdMetaIscedFields.mjs'
import EdMetaIscedGrades from './raw/EdMetaIscedGrades.mjs'
import ISO_639_3_Data from './raw/ISO_639_3_tab-DATA'
import License_Data from './raw/licenses-DATA'
import EdAssetType_Data from './raw/types-DATA'

await Promise.all([
  initIscedFields(),
  initIscedGrades(),
  initLicenses(),
  initLanguages(),
  initEdAssetTypes(),
])

export default 1

async function initIscedFields() {
  const IscedFieldDataDocs = EdMetaIscedFields.map(({ _key, published, codePath, name }) => {
    const IscedFieldDataDoc: IscedFieldDataType & { _key: string } = {
      _key,
      published,
      codePath,
      name,
    }
    return IscedFieldDataDoc
  })
  await Promise.all(
    IscedFieldDataDocs.map(IFData => {
      return shell.call(create)(IscedField.entityClass, IFData, { pkgCreator: true })
    }),
  )
  await addTextSearchFields(IscedField.collection.name, ['name', 'codePath'])
}

async function initIscedGrades() {
  const IscedGradeDataDocs = EdMetaIscedGrades.map(({ _key, published, codePath, name }) => {
    const IscedGradeDataDoc: IscedGradeDataType & { _key: string } = {
      _key,
      published,
      codePath,
      name,
    }
    return IscedGradeDataDoc
  })
  await Promise.all(
    IscedGradeDataDocs.map(IGData => {
      return shell.call(create)(IscedGrade.entityClass, IGData, { pkgCreator: true })
    }),
  )
}

async function initLanguages() {
  const LanguageDataDocs = ISO_639_3_Data.map<LanguageDataType>(
    ({ id, name, part1, part2b, part2t, scope, type }) => {
      const LanguageDataDoc: LanguageDataType & { _key: string } = {
        _key: id as never,
        code: id,
        name,
        part1,
        part2b,
        part2t,
        scope,
        type,
        published: !!part1,
      }
      return LanguageDataDoc
    },
  )
  await Promise.all(
    LanguageDataDocs.map(LangData => {
      return shell.call(create)(Language.entityClass, LangData, { pkgCreator: true })
    }),
  )
}

async function initLicenses() {
  const LicensesDataDocs = License_Data.map(({ code, description, published }) => {
    const LicenseDataDoc: LicenseDataType & { _key: string } = {
      _key: code as never,
      code,
      description,
      published,
      // added restrictiveness on v3
      restrictiveness: undefined as never,
    }
    return LicenseDataDoc
  })
  await Promise.all(
    LicensesDataDocs.map(LicenseData => {
      return shell.call(create)(License.entityClass, LicenseData, { pkgCreator: true })
    }),
  )
}

async function initEdAssetTypes() {
  const EdAssetTypeDataDocs = EdAssetType_Data.map(({ code, description }) => {
    const EdAssetTypeDataDoc: EdAssetTypeDataType & { _key: string } = {
      _key: code as never,
      code,
      description,
      published: true,
    }
    return EdAssetTypeDataDoc
  })
  await Promise.all(
    EdAssetTypeDataDocs.map(ResTypeData => {
      return shell.call(create)(EdAssetType.entityClass, ResTypeData, { pkgCreator: true })
    }),
  )
}
