import { contentLanguages_iso_639_3_Setup, contentLicensesSetup } from '../../contentCategories.model/setup'
import { configs } from '../types'

export const DEFAULT_CONFIGS: configs = {
  enabledCategories: {
    languages: contentLanguages_iso_639_3_Setup.filter(([, { part1 }]) => !!part1).map(([code]) => ({ code })),
    licenses: contentLicensesSetup.filter((/* licenseRecord */) => true).map(([code]) => ({ code })),
  },
}
