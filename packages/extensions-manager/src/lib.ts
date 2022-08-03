import { SafePackageJson } from '@moodlenet/core'
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
  // const keywordsString = ['moodlenetPackage', ...keywords].map(kw => `keywords:${kw}`).join(' ')
  const keywordsString = keywords.map(kw => `keywords:${kw}`).join(' ')
  const text = `${searchText} ${keywordsString}`

  const res = await axios.get<SearchResponse>(`${registry}/-/v1/search`, { params: { text } })
  console.log(
    'npm resp packages',
    res.data.objects.map(_ => _.package),
  )

  // !!!!!!! REMOVE ME ! JUST FOR DEMO !
  res.data.objects = res.data.objects.filter(({ package: { name } }) => !___ignore___mn2_pkgs.includes(name))
  // !!!!!!!

  return res.data
}
/* 
keywords:moodlenetPackage
 */

const ___ignore___mn2_pkgs = ['@moodlenet/webapp', '@moodlenet/common', '@moodlenet/backend', '@moodlenet/ce-platform']

export function extNameDescription(pkgJson: SafePackageJson) {
  const [displayName = '', description = ''] = (pkgJson.description ?? '').split('\n')
  return { displayName, description }
}
