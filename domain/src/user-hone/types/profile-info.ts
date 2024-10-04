import { _nil, url_string } from '@moodle/lib-types'

export interface ProfileInfo {
  displayName: string
  aboutMe: string
  location: string
  siteUrl: _nil | url_string
  // backgroundImage: Image | _nil
  // avatarImage: Image | _nil
}
