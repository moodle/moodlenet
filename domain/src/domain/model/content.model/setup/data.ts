import { contentLanguages_iso_639_3_Setup, contentLicensesSetup } from '.'
import { languageSpace, licenseSpace } from '../content.model'

export const CONTENT_CATEGORIES_DATA_SETUP = {
  languages: contentLanguages_iso_639_3_Setup.map<{ id: string; data: moo.model.type.sSpaceData<languageSpace> }>(([id, data]) => ({
    id,
    data: { data, meta: { enabled: !!data.part1 } },
  })),
  licenses: contentLicensesSetup.map<{ id: string; data: moo.model.type.sSpaceData<licenseSpace> }>(([id, data]) => ({ id, data: { data, meta: { enabled: true } } })),
}
