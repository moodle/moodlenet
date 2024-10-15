import { _nullish, assetRecord, url_string } from '@moodle/lib-types'

export interface ProfileInfo {
  displayName: string
  aboutMe: string
  location: string
  siteUrl: _nullish | url_string
  background: _nullish | assetRecord
  avatar: _nullish | assetRecord
}
export type profileImage = 'avatar' | 'background'
