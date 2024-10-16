import { d_u, date_time_string, mimetype, url_string } from '@moodle/lib-types'
import { fileHashes } from './temp'

export type asset = d_u<
  {
    local: local_asset_meta & { path: string }
    external: external_asset_meta
  },
  'type'
>

export type local_asset_meta = {
  name: string
  size: number
  mimetype: mimetype
  hash: fileHashes
  uploaded: {
    at: date_time_string
    primarySessionId: string
  }
}
export type external_asset_meta = { url: url_string; credits?: credits }
export type credits = {
  owner: { name: string; url: url_string }
  provider?: { name: string; url: url_string }
}
