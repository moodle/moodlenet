import execa from 'execa'
import { cp, readFile, writeFile } from 'fs/promises'
import http from 'http'
import https from 'https'
import { resolve } from 'path'
import tar from 'tar'
import { DEFAULT_NPM_REGISTRY } from '../../main/default-consts'
import { makeInstallationFolder } from './lib'
import { NpmInstallReq, PkgInstaller } from './types'

export const npmInstaller: PkgInstaller<NpmInstallReq> = async ({
  installPkgReq: { registry = DEFAULT_NPM_REGISTRY, pkgId },
  pkgsFolder,
  useFolderName,
}) => {
  const { absInstallationFolder, relInstallationFolder } = await makeInstallationFolder({
    pkgsFolder,
    pkgId,
    useFolderName,
  })
  console.log('getting tarGzUrl...', { registry, pkgId })
  const { stdout: tarGzUrl } = await execa('npm', ['v', pkgId, 'dist.tarball', '--registry', registry])
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
  await execa('npm', ['install', /* '--registry', registry, */ '--production'], {
    cwd: absInstallationFolder,
  })

  return { installationFolder: relInstallationFolder }
}
