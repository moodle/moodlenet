import { _nullish, url_string } from '@moodle/lib-types'
import { asset } from '../../storage'

export interface ProfileInfo {
  urlSafeName: string
  displayName: string
  aboutMe: string
  location: string
  siteUrl: _nullish | url_string
  background: _nullish | asset
  avatar: _nullish | asset
}
export type profileImage = 'avatar' | 'background'
