import { language, license } from './content-categories'

export type enabledContentCategories = {
  languages: Pick<language, 'code' | 'name'>[]
  licenses: license[]
}
