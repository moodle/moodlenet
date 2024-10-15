import { asset, assetRecord, createPathProxy, url_path_string_schema } from '@moodle/lib-types'
import { join, resolve } from 'path'
import sanitizeFilename from 'sanitize-filename'
import { moodlePrimary } from '../../'
import { filesystem, fs, fsDirectories, fsUrlPathGetter } from './types'

export function provide_assetRecord2asset(moodlePrimary: moodlePrimary, assetRecord: assetRecord) {
  const prefixed_domain_file_paths = createPathProxy<fs<filesystem, () => Promise<asset>>>({
    async apply({ path }) {
      if (assetRecord.type === 'external') {
        return {
          type: 'external',
          url: assetRecord.url,
          credits: assetRecord.credits,
        }
      } else if (assetRecord.type === 'uploaded') {
        const { filestoreHttp } = await moodlePrimary.env.application.deployments()
        const url = url_path_string_schema.parse(
          [filestoreHttp.href, ...path, assetRecord.uploadMeta.name].join('/'),
        )
        return {
          type: 'uploaded',
          url,
        }
      }
      throw new Error(`Invalid assetRecord type ${JSON.stringify(assetRecord)}`)
    },
  })
  return prefixed_domain_file_paths
}
export function file_server_domain_file_url({ primary }: { primary: moodlePrimary }) {
  const prefixed_domain_file_paths = createPathProxy<fs<filesystem, fsUrlPathGetter>>({
    async apply({ path }) {
      const { filestoreHttp } = await primary.env.application.deployments()
      const _path = [filestoreHttp.href, ...path].join('/')
      return url_path_string_schema.parse(_path)
    },
  })
  return prefixed_domain_file_paths
}
// export function newFsFileRelativePath(filename: string, date = new Date()) {
//   return [
//     String(date.getFullYear()),
//     String(date.getMonth() + 1).padStart(2, '0'),
//     String(date.getUTCDate()).padStart(2, '0'),
//     String(date.getUTCHours()).padStart(2, '0'),
//     String(date.getMinutes()).padStart(2, '0'),
//     String(date.getSeconds()).padStart(2, '0'),
//     filename,
//   ]
// }
export function getSanitizedFileName(originalFilename: string) {
  const sanitized = sanitizeFilename(originalFilename)
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9._-]/gi, '_')
    .replace(/^[_-]+/, '')
    .replace(/[_-]+$/, '')
    .replace(/[_-]+/g, '_')

  return sanitized
  // originalFilename.normalize("NFD").replace(/\p{Diacritic}/gu, "")
  // const origExt = originalFilename.split('.').pop()
  // const mDotExt = origExt ? `.${origExt}` : ''
  // String(Math.random()).substring(2, 20) + mDotExt
}
export function getRndPrefixedSanitizedFileName(originalFilename: string, prefixLength = 3) {
  const rnd = String(Math.random()).substring(2, 2 + prefixLength)
  return `${rnd}_${getSanitizedFileName(originalFilename)}`
  // originalFilename.normalize("NFD").replace(/\p{Diacritic}/gu, "")
  // const origExt = originalFilename.split('.').pop()
  // const mDotExt = origExt ? `.${origExt}` : ''
  // String(Math.random()).substring(2, 20) + mDotExt
}

// export function getSanitizedRelativeFilepath({
//   originalFilename,
//   date,
// }: {
//   originalFilename: string
//   date?: Date
// }) {
//   const sanitizedName = getSanitizedFileName(originalFilename)
//   return newFsFileRelativePath(sanitizedName, date)
// }
export const MOODLE_DEFAULT_HOME_DIR = '.moodle.home'
export function getFsDirectories({
  domainName,
  homeDir,
}: {
  homeDir: string
  domainName: string
}): fsDirectories {
  const currentDomainDir = resolve(homeDir, getSanitizedFileName(domainName))
  const temp = join(currentDomainDir, '.temp')
  const fsStorage = join(currentDomainDir, 'fs-storage')
  return {
    currentDomainDir,
    temp,
    fsStorage,
  }
}
