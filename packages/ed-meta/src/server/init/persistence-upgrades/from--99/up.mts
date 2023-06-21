import { create } from '@moodlenet/system-entities/server'
import { shell } from '../../../shell.mjs'
import type { EdAssetTypeDataType, LanguageDataType, LicenseDataType } from '../../../types.mjs'
import { EdAssetType, Language, License } from '../../sys-entities.mjs'
import ISO_639_3_Data from './raw/ISO_639_3_tab-DATA.js'
import License_Data from './raw/licenses-DATA.js'
import EdAssetType_Data from './raw/types-DATA.js'

await Promise.all([initLicenses(), initLanguages(), initEdAssetTypes()])

async function initLanguages() {
  const LanguageDataDocs = ISO_639_3_Data.map<LanguageDataType>(
    ({ id, name, part1, part2b, part2t, scope, type }) => {
      const LanguageDataDoc: LanguageDataType & { _key: never } = {
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
    const LicenseDataDoc: LicenseDataType & { _key: never } = {
      _key: code as never,
      code,
      description,
      published,
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
    const EdAssetTypeDataDoc: EdAssetTypeDataType & { _key: never } = {
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

export default -98
