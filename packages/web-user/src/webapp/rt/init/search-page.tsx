import { SearchPagePlugin } from '@moodlenet/react-app/webapp'
import {
  SearchProfileSectionAddon,
  SearchProfileWrapperAddon,
} from '../page/search/ProfileSearchPageAddonHooks.js'

SearchPagePlugin.register(({ useSearchEntitySections, useWrappers }) => {
  useSearchEntitySections(SearchProfileSectionAddon)
  useWrappers(SearchProfileWrapperAddon)
})
