import { _nullish } from '@moodle/lib-types'
import { asset } from '../../storage'

export type contributorInfo = {
  profileId: string
  displayName: string
  urlSafeProfileName: string
  avatar: _nullish | asset
  points: number
}
