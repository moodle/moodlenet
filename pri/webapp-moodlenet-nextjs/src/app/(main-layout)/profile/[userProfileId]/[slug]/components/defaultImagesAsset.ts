import { url_string } from '@moodle/lib-types'
import { asset } from '@moodle/module/storage'
import defaultAvatar from '../../../../../../ui/lib/assets/img/default-avatar.png'
import defaultBackground from '../../../../../../ui/lib/assets/img/default-landing-background.png'

export const defaultProfileAvatarAsset: asset = {
  type: 'external',
  url: defaultAvatar.src as url_string,
}
export const defaultProfileBackgroundAsset: asset = {
  type: 'external',
  url: defaultBackground.src as url_string,
}
