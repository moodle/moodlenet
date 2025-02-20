/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { configs, contentLanguage, contentLicense } from './types'
declare global {
  namespace moo {
    interface Models {
      contentCategories: contentCategories
    }
  }
}
export type contentCategories = moo.model<contentCategoriesModel>

export type contentCategoriesModel = {
  configs: configs
  categories: {
    contentLanguages: moo.model.type.idSpaceMap<{ data: contentLanguage }>
    contentLicenses: moo.model.type.idSpaceMap<{ data: contentLicense }>
  }
}
