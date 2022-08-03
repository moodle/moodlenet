import assert from 'assert'
import { mkdir } from 'fs/promises'
import { relative, resolve } from 'path'
import { PkgInstallationId } from '../types'

export function getRelInstallationFolder({
  absInstallationFolder,
  pkgsFolder,
}: {
  absInstallationFolder: string
  pkgsFolder: string
}) {
  const installationFolder = relative(pkgsFolder, absInstallationFolder)
  return installationFolder
}

export async function makeInstallationFolder({
  pkgId,
  pkgsFolder,
  useFolderName,
}: {
  pkgId: string
  pkgsFolder: string
  useFolderName?: string
}) {
  const { absInstallationFolder, pkgInstallationId } = getInstallationFolder({ pkgId, pkgsFolder, useFolderName })
  await mkdir(absInstallationFolder, { recursive: true })
  return { pkgInstallationId, absInstallationFolder }
}

export function getInstallationFolder({
  pkgId,
  pkgsFolder,
  useFolderName,
}: {
  pkgId: string
  pkgsFolder: string
  useFolderName?: string
}) {
  const pkgInstallationId = useFolderName ?? getPkgInstallationId(pkgId)
  const absInstallationFolder = resolve(pkgsFolder, pkgInstallationId)
  return { absInstallationFolder, pkgInstallationId }
}

export function getPkgInstallationId(pkgId: string): PkgInstallationId {
  const pkgNameScopeTuple = pkgId.split('/').reverse()
  console.log('split pkgNameScopeTuple xxx ', pkgNameScopeTuple)
  assert(
    pkgNameScopeTuple.length > 0 &&
      pkgNameScopeTuple.length < 3 &&
      (pkgNameScopeTuple.length === 2 ? pkgId.startsWith('@') : true),
    `unexpected package id format "${pkgId}"`,
  )

  const [name, scope] = pkgNameScopeTuple as [name: string, scope?: string]
  const uid = Math.random().toString(36).substring(2, 8)
  const safeName = `${scope ? `__${scope.substring(1)}__` : ``}${name}`
  const safeInstallationFolderName = `${safeName}__${uid}`
  return safeInstallationFolderName
}

/* 
// imposta le folder sulla cartella riscrivibile
export function installDirsInfo(): installDirsInfo {
  const ignoreFolder = resolve(__dirname, '..', '..', '.ignore')
  assert(existsSync(ignoreFolder))
  const pkgMng = resolve(ignoreFolder, 'pkgmngfolder')
  if (!existsSync(pkgMng)) {
    mkdirSync(pkgMng)
  }
  const pkgMngTmp = resolve(pkgMng, 'tmp')
  if (!existsSync(pkgMngTmp)) {
    mkdirSync(pkgMngTmp)
  }

  if (existsSync(pkgMngTmp)) {
    console.log('tmp folder exist', pkgMngTmp)
  } else throw new Error('cant create folder ' + pkgMngTmp)
  return { current: __dirname, pkgMng, pkgMngTmp }
}
export type installDirsInfo = {
  current: string
  pkgMng: string
  pkgMngTmp: string
}
 */
