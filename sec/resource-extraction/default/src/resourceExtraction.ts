import { unreachable_never } from '@moodle/lib-types'
import { extractTextFromFile } from './from-file'
import { extractTextFromLink } from './from-link'
import { assetExtractor } from './types'

export const extractResourceData: assetExtractor = async ({ asset, env }) => {
  if (asset.type === 'local') {
    return extractTextFromFile({ asset, env })
  } else if (asset.type === 'external') {
    return extractTextFromLink({ asset, env })
  } else {
    return unreachable_never(asset)
  }
}
