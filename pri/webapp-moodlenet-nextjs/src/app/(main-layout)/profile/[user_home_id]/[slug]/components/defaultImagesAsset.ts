import { url_string } from '@moodle/lib-types'
import { asset } from '@moodle/module/storage'
import defaultAvatar from '../../../../../../ui/lib/assets/img/default-avatar.png'

export const defaultImageAsset: asset = {
  type: 'external',
  url: defaultAvatar.src as url_string,
}
