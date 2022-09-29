import { InstallPkgReq, listEntries, SafePackageJson } from '@moodlenet/core'
import _axios from 'axios'
import { DeployedPkgInfo, SearchPackagesResObject, SearchPackagesResponse } from './types/data.mjs'
import { SearchResponse } from './types/npmRegistry.mjs'

const axios = _axios.default

export async function listDeployed() {
  const entries = await listEntries()
  return entries.map<DeployedPkgInfo>(entry => ({
    packageJson: entry.pkgInfo.packageJson,
    pkgId: entry.pkgInfo.pkgId,
    readme: entry.pkgInfo.readme,
  }))
}

export async function searchPackages({
  searchText,
  registry = getRegistry(),
}: {
  searchText: string
  registry?: string
}): Promise<SearchPackagesResponse> {
  const [searchRes, pkgEntries] = await Promise.all([
    searchPackagesFromRegistry({ registry, searchText: `moodlenet ${searchText}` }),
    listEntries(),
  ])
  const objects = searchRes.objects.map(
    ({ package: { name: pkgName, description, keywords, version = '*', links } }) => {
      // const isInstalled = !!installedPackages.find(pkgInfo => pkgInfo.packageJson.name === name)
      const installedPkgIds = pkgEntries.map(pkgEntry => pkgEntry.pkgInfo.pkgId)
      const installedPkgId = installedPkgIds.find(pkgId => pkgId.name === pkgName /* &&pkgId.version=== version  */)

      const installPkgReq: InstallPkgReq = {
        type: 'npm',
        registry,
        pkgId: { name: pkgName, version },
      }
      const objects: SearchPackagesResObject = {
        pkgName,
        description: description ?? '',
        keywords: keywords ?? [],
        version,
        registry,
        homepage: links?.homepage,
        ...(installedPkgId ? { installed: true, pkgId: installedPkgId } : { installed: false, installPkgReq }),
      }
      return objects
    },
  )
  return { objects }
}
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

const DEFAULT_NPM_REGISTRY = 'https://registry.npmjs.org/'
export function getRegistry(_reg?: string | undefined) {
  return _reg ?? process.env.NPM_CONFIG_REGISTRY ?? DEFAULT_NPM_REGISTRY
}
