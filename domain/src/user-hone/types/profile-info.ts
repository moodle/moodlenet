import { _nullish, url_string } from '@moodle/lib-types'

export interface ProfileInfo {
  displayName: string
  aboutMe: string
  location: string
  siteUrl: _nullish | url_string
  // backgroundImage:  _nullish | file_or_url
  // avatarImage:  _nullish | file_or_url
}
export type profileImage = 'avatar' | 'background'
