import { mod_ctrl } from '@moodle/core/domain'
import moodlenet_mod from './mod'

export const ctrl: mod_ctrl<moodlenet_mod> = {
  read: {
    async 'website-info'(pl) {
      return {}
    },
  },
}
