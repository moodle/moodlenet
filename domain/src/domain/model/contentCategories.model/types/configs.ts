import { contentLanguageCode, contentLicenseCode } from './content-categories'

export type configs = {
  enabledCategories: enabledContentCategories
}

export type enabledContentCategories = {
  languages: { code: contentLanguageCode }[]
  licenses: { code: contentLicenseCode }[]
}
