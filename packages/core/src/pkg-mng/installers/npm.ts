import execa from 'execa'
import http from 'http'
import https from 'https'
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
  const { stdout: tarGzUrl } = await execa('npm', ['v', pkgId, 'dist.tarball', 'registry', registry])
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
  console.log('install deps')
  await execa('npm', ['install', '--omit', 'peer', '--omit', 'dev'], { cwd: absInstallationFolder })

  return { installationFolder: relInstallationFolder }
}
