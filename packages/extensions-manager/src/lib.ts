import axios from 'axios'
import { SearchResponse } from './types/npmRegistry'

export async function searchPackagesFromRegistry({
  registry,
  searchText,
  keywords = [],
}: {
  registry: string
  searchText: string
  keywords?: string[]
}) {
  const keywordsString = keywords.map(kw => `keywords:${kw}`).join(' ')
  const text = `${searchText} ${keywordsString}`

  const res = await axios.get<SearchResponse>(`${registry}/-/v1/search`, { params: { text } })
  console.log('npm resp', res.data)
  return res.data
}
