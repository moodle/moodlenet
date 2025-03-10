import { contentLanguages_iso_639_3_Setup, contentLicensesSetup } from '.'
import { catRecord } from '../content.model'
import { language, license } from '../types'

export const CONTENT_CATEGORIES_DATA_SETUP = {
  languages: contentLanguages_iso_639_3_Setup.map<catRecord<language>>(language => ({
    data: language,
    meta: { enabled: !!language.part1 },
  })),
  licenses: contentLicensesSetup.map<catRecord<license>>(license => ({ data: license, meta: { enabled: true } })),
}
