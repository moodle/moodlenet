import { _any, d_u__d, unreachable_never, url_path_string, url_string } from '@moodle/lib-types'
import sanitizeFilename from 'sanitize-filename'
import { adoptAssetResponse, asset, useTempFileResult } from '../types'

// export function newFsFileRelativePath(filename: string, date = ctx.now) {
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
export function getAssetUrl<_asset extends asset>(
  asset: _asset,
  filestoreHttpHref: url_string,
): _asset extends { type: 'none' } ? undefined : url_string {
  return asset.type === 'none'
    ? (undefined as _any) // TS doesn't infer here we are in `_asset extends { type: 'none' }` branch 🤔
    : asset.type === 'external'
      ? asset.url
      : asset.type === 'stored'
        ? (`${filestoreHttpHref}/${asset.path}/${asset.name}` as url_path_string)
        : unreachable_never(asset)
}

export async function useTempFileResult_to_adoptAssetResponse(
  p_useTempFileResult: useTempFileResult | Promise<useTempFileResult>,
): Promise<d_u__d<adoptAssetResponse<'stored'>, 'status', 'done' | 'error'>> {
  const [done, result] = await p_useTempFileResult
  return done
    ? {
        status: 'done',
        asset: result.asset,
      }
    : {
        status: 'error',
        message: result.reason,
      }
}
