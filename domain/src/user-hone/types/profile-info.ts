import { _nullish, url_string } from '@moodle/lib-types'

export interface ProfileInfo {
  displayName: string
  aboutMe: string
  location: string
  siteUrl: _nullish | url_string
  // backgroundImage: Image | _nullish
  // avatarImage: Image | _nullish
}
