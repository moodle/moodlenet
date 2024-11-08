import { d_u, date_time_string, mimetype } from '@moodle/lib-types'
import { external_content } from '../../content/types/content-categories'
import { fileHashes } from './temp'


// TODO: move this to domain/src/modules/content/types/content-categories.ts ?
export type asset = d_u<
  {
    local: local_asset_meta
    external: external_content
    none: unknown
  },
  'type'
>
export const NONE_ASSET: asset = { type: 'none' }

export type local_asset_meta = {
  path: string
  name: string
  size: number
  mimetype: mimetype
  hash: fileHashes
  uploaded: {
    date: date_time_string
    primarySessionId: string
  }
}

