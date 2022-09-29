import { defApi } from '@moodlenet/core'
import { searchPackages } from './lib.mjs'
import { SearchPackagesResponse } from './types/data.mjs'

export default {
  searchPackages: defApi(
    _ctx =>
      async ({ searchText, registry }: { searchText: string; registry?: string }): Promise<SearchPackagesResponse> => {
        return searchPackages({
          searchText,
          registry,
        })
      },
    () => true,
  ),
}
