import { useTempFileResult } from '@moodle/lib-domain-fs'
import { any_, d_u__d, unreachable_never, url_path_string, url_string } from '@moodle/lib-types'
import { adoptAssetResult, maybeAsset } from '../types'

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
export function getAssetUrl<_asset extends maybeAsset>(
  asset: _asset,
  filestoreHttpHref: url_string,
): _asset extends { type: 'none' } ? undefined : url_string {
  return asset.type === 'none'
    ? (undefined as any_) // TS doesn't infer here we are in `_asset extends { type: 'none' }` branch 🤔
    : asset.type === 'external'
      ? asset.url
      : asset.type === 'stored'
        ? (`${filestoreHttpHref}/${asset.path.join('/')}/${asset.name}` as url_path_string)
        : unreachable_never(asset)
}

export async function useTempFileResult_to_adoptAssetResult(
  p_useTempFileResult: useTempFileResult | Promise<useTempFileResult>,
): Promise<d_u__d<adoptAssetResult<'stored'>, 'status', 'done' | 'error'>> {
  const [done, result] = await p_useTempFileResult
  return done
    ? {
        status: 'done',
        asset: {
          type: 'stored',
          mimetype: result.fileMeta.mimetype,
          name: result.fileMeta.name,
          size: result.fileMeta.size,
          uploaded: result.fileMeta.uploaded,
          path: result.path,
        },
      }
    : {
        status: 'error',
        message: result.reason,
      }
}
