import { SearchPagePlugin } from '@moodlenet/react-app/webapp'
import {
  SearchProfileSectionAddon,
  SearchProfileWrapperAddon,
} from '../page/search/ProfileSearchPageAddonHooks'

SearchPagePlugin.register(() => {
  return {
    searchEntitySections: SearchProfileSectionAddon,
    wrappers: SearchProfileWrapperAddon,
  }
})
