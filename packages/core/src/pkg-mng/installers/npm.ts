import axios from 'axios'
import execa from 'execa'
import { cp, readFile, writeFile } from 'fs/promises'
import http from 'http'
import https from 'https'
import { resolve } from 'path'
import tar from 'tar'
import { makeInstallationFolder } from './lib'
import { NpmInstallReq, PkgInstaller } from './types'

type Dist = {
  tarball: string
}
type _With_Dist = {
  dist: Dist
}
type _Vers_Dist =
  | _With_Dist
  | {
      versions: Record<string, _With_Dist>
    }
export const npmInstaller: PkgInstaller<NpmInstallReq> = async ({
  installPkgReq: { registry, pkgId },
  pkgsFolder,
  useFolderName,
}) => {
  const { absInstallationFolder, relInstallationFolder } = await makeInstallationFolder({
    pkgsFolder,
    pkgId,
    useFolderName,
  })
  console.log('getting tarGzUrl...', { registry, pkgId })

  const hasVersion = pkgId.lastIndexOf('@') > 0

  const pkgName = hasVersion ? pkgId.substring(0, pkgId.lastIndexOf('@')) : pkgId
  const version = hasVersion ? pkgId.substring(pkgId.lastIndexOf('@') + 1) : undefined

  const pkg_meta_url = `${registry}/${pkgName}${version ? `/${version}` : ``}`
  console.log({ pkg_meta_url, registry, pkgName, version })
  const { data: _vers_dist } = await axios.get<_Vers_Dist>(pkg_meta_url).catch(err => {
    console.error(err)
    throw err
  })
  console.log('_vers_dist', _vers_dist)
  const dist = 'dist' in _vers_dist ? _vers_dist.dist : Object.values(_vers_dist.versions)[0]!.dist
  const tarGzUrl = dist.tarball
  console.log('down lib', tarGzUrl)
  const useHttpLib = tarGzUrl.startsWith('https') ? https : http
  await new Promise((resolve, reject) => {
    useHttpLib.get(tarGzUrl, function (response) {
      const destStream = tar.x({ strip: 1, C: absInstallationFolder })
      response.pipe(destStream)
      destStream.once('finish', resolve)
      destStream.once('error', err => reject(err))
      response.once('error', err => reject(err))
    })
  })
  const pkgJsonFile = resolve(absInstallationFolder, 'package.json')
  await cp(pkgJsonFile, `${pkgJsonFile}_backup`)
  const pkgJson = JSON.parse(await readFile(pkgJsonFile, 'utf-8'))
  delete pkgJson.devDependencies
  delete pkgJson.peerDependencies
  await writeFile(pkgJsonFile, JSON.stringify(pkgJson, null, 2))
  console.log('install deps')
  const installRes = await execa(
    'npm',
    ['install', /* '--registry', registry, */ '--legacy-peer-deps', '--omit', 'dev', '--omit', 'peer'],
    {
      cwd: absInstallationFolder,
      timeout: 600000,
    },
  )
  console.log({ pkgName, ...installRes })
  return { installationFolder: relInstallationFolder }
}
