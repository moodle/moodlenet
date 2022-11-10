import type { InstallPkgReq, PkgIdentifier } from '@moodlenet/core'
import { NPM_REGISTRY } from '@moodlenet/core'
import _axios from 'axios'
import type {
  DeployedPkgInfo,
  SearchPackagesResObject,
  SearchPackagesResponse,
} from './types/data.mjs'
import type { SearchResponse } from './types/npmRegistry.mjs'
import { corePkg } from './use-pkg-apis.mjs'

const axios = _axios.default

export async function install(installPkgReqs: InstallPkgReq[]) {
  await corePkg.api('pkg-mng/install')(installPkgReqs)
  return
}

export async function uninstall(pkgIds: PkgIdentifier[]) {
  await corePkg.api('pkg-mng/uninstall')(pkgIds)
  return
}

export async function listDeployed() {
  const entries = await corePkg.api('active-pkgs/ls')()
  return entries.map<DeployedPkgInfo>(entry => ({
    packageJson: entry.pkgInfo.packageJson,
    pkgId: entry.pkgId,
    readme: entry.pkgInfo.readme,
  }))
}

export async function searchPackages({
  searchText,
}: {
  searchText: string
}): Promise<SearchPackagesResponse> {
  const [searchRes, pkgEntries] = await Promise.all([
    searchPackagesFromRegistry({ searchText: `moodlenet ${searchText}` }),
    corePkg.api('active-pkgs/ls')(),
  ])
  const objects = searchRes.objects.map(
    ({ package: { name: pkgName, description, keywords, version = '*', links } }) => {
      // const isInstalled = !!installedPackages.find(pkgInfo => pkgInfo.packageJson.name === name)
      const installedPkgIds = pkgEntries.map(pkgEntry => pkgEntry.pkgId)
      const installedPkgId = installedPkgIds.find(
        pkgId => pkgId.name === pkgName /* &&pkgId.version=== version  */,
      )

      const installPkgReq: InstallPkgReq = {
        type: 'npm',
        pkgId: { name: pkgName, version },
      }
      const objects: SearchPackagesResObject = {
        pkgName,
        description: description ?? '',
        keywords: keywords ?? [],
        version,
        registry: NPM_REGISTRY,
        homepage: links?.homepage,
        ...(installedPkgId
          ? { installed: true, pkgId: installedPkgId }
          : { installed: false, installPkgReq }),
      }
      return objects
    },
  )
  return { objects }
}

export async function searchPackagesFromRegistry({
  searchText,
  keywords = [],
}: {
  searchText: string
  keywords?: string[]
}) {
  // const keywordsString = ['moodlenetPackage', ...keywords].map(kw => `keywords:${kw}`).join(' ')
  const keywordsString = keywords.map(kw => `keywords:${kw}`).join(' ')
  const text = `${searchText} ${keywordsString}`

  const res = await axios.get<SearchResponse>(`${NPM_REGISTRY}/-/v1/search`, { params: { text } })

  // FIXME:
  // !!!!!!! REMOVE ME ! JUST FOR DEMO !
  res.data.objects = res.data.objects.filter(
    ({ package: { name } }) => !___ignore___mn2_pkgs.includes(name),
  )
  // !!!!!!!

  return res.data
}
/* 
keywords:moodlenetPackage
 */
// !!!!!!!

// FIXME:
// !!!!!!! REMOVE ME ! JUST FOR DEMO !
const ___ignore___mn2_pkgs = [
  '@moodlenet/webapp',
  '@moodlenet/common',
  '@moodlenet/backend',
  '@moodlenet/ce-platform',
]
// !!!!!!!
