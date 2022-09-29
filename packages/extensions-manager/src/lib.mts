import { SafePackageJson } from '@moodlenet/core'
import _axios from 'axios'
import { SearchPackagesResponse } from './types/data.mjs'
import { SearchResponse } from './types/npmRegistry.mjs'

const axios = _axios.default

export async function searchPackages({
  searchText,
  registry = getRegistry(),
}: {
  searchText: string
  registry?: string
}): Promise<SearchPackagesResponse> {
  const [
    searchRes,
    {
      msg: {
        data: { pkgInfos },
      },
    } /* ,
              {
                msg: {
                  data: { pkgInfos: installedPackages },
                },
              }, */,
  ] = await Promise.all([
    searchPackagesFromRegistry({ registry, searchText: `moodlenet ${searchText}` }),
    core.access.fetch('ext/listDeployed')(),
    // shell.lib.fetch<CoreExt>(shell)('@moodlenet/core@0.1.0::pkg/getInstalledPackages')(),
  ])
  const objects = searchRes.objects.map(({ package: { name: pkgName, description, keywords, version, links } }) => {
    // const isInstalled = !!installedPackages.find(pkgInfo => pkgInfo.packageJson.name === name)
    const pkgInstallationId = pkgInfos
      //.map(({ packageInfo }) => packageInfo)
      .find(packageInfo => packageInfo.packageJson.name === pkgName)?.id
    const installPkgReq: InstallPkgReq = {
      type: 'npm',
      registry,
      pkgId: version ? `${pkgName}@${version}` : pkgName,
    }
    const objects: SearchPackagesResObject = {
      pkgName,
      description: description ?? '',
      keywords: keywords ?? [],
      version,
      registry,
      homepage: links?.homepage,
      ...(pkgInstallationId ? { installed: true, pkgInstallationId } : { installed: false, installPkgReq }),
    }
    return objects
  })
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
