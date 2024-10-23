import { d_u, date_time_string, mimetype } from '@moodle/lib-types'
import { external_content } from '../../content/types/content-categories'
import { fileHashes } from './temp'

export type asset = d_u<
  {
    local: local_asset_meta & { path: string }
    external: external_content
  },
  'type'
>

export type local_asset_meta = {
  name: string
  size: number
  mimetype: mimetype
  hash: fileHashes
  uploaded: {
    date: date_time_string
    primarySessionId: string
  }
}
