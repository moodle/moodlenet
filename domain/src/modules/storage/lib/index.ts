import sanitizeFilename from 'sanitize-filename'
import { asset, uploaded_blob_meta, usingTempFile } from '../types'
import { url_string } from '@moodle/lib-types'

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
}
export function getRndPrefixedSanitizedFileName(originalFilename: string, prefixLength = 3) {
  const rnd = String(Math.random()).substring(2, 2 + prefixLength)
  return `${rnd}_${getSanitizedFileName(originalFilename)}`
}
export function getAssetUrl(asset: asset, filestoreHttpHref: url_string) {
  return asset.type === 'external' ? asset.url : `${filestoreHttpHref}/${asset.path}/${asset.name}`
}

export function usingTempFile2asset({ path, uploaded_blob_meta }: usingTempFile) {
  const asset: asset = {
    type: 'local',
    path,
    hash: uploaded_blob_meta.hash,
    uploaded: { at: uploaded_blob_meta.uploaded.at, primarySessionId: uploaded_blob_meta.uploaded.primarySessionId },
    mimetype: uploaded_blob_meta.mimetype,
    name: uploaded_blob_meta.name,
    size: uploaded_blob_meta.size,
  }
  return asset
}
