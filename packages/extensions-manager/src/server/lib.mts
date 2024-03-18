import type { InstallPkgReq, PkgIdentifier } from '@moodlenet/core'
import { npm, npmRegistry, pkgRegistry } from '@moodlenet/core'
import axios from 'axios'
import type {
  DeployedPkgInfo,
  SearchPackagesResObject,
  SearchPackagesResponse,
} from '../common/data.mjs'
import type { SearchResponse } from '../common/npmRegistry.mjs'

export async function install(installPkgReqs: InstallPkgReq[]) {
  return npm.install(installPkgReqs)
}

export async function uninstall(pkgIds: PkgIdentifier[]) {
  return npm.uninstall(pkgIds)
}

export async function listDeployed() {
  const entries = await pkgRegistry.listEntries()
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
    pkgRegistry.listEntries(),
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
        registry: npmRegistry,
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

  const res = await axios.get<SearchResponse>(`${npmRegistry}/-/v1/search`, {
    params: { text },
  })

  return res.data
}
