import { languageCode, licenseCode } from './content-categories'

export type configs = {
  enabledCategories: enabledContentCategories
}

export type enabledContentCategories = {
  languages: { code: languageCode }[]
  licenses: { code: licenseCode }[]
}
