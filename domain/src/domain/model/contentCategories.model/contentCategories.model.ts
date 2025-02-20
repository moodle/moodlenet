/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { configs, language, license } from './types'
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
    contentLanguages: moo.model.type.idSpaceMap<{ data: language }>
    contentLicenses: moo.model.type.idSpaceMap<{ data: license }>
  }
}
