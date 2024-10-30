import { Configs } from '../types'

export const user_profile_default_configs: Configs = {
  profileInfoPrimaryMsgSchemaConfigs: {
    profileInfoMeta: {
      aboutMe: { max: 500 },
      displayName: { min: 3, max: 60, regex: null },
      location: { max: 300 },
      siteUrl: { max: 2048 },
    },
  },
}
