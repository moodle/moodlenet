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
