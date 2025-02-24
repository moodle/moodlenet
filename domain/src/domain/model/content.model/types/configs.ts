import { language, license } from './content-categories'

export type contentConfigs = never
// {
//   // NO enabledCategories: enabledContentCategories
// }

export type enabledContentCategories = {
  languages: ({ code: string } & language)[]
  licenses: ({ code: string } & license)[]
}
