import { userHome } from '@moodle/domain'

export const user_home_default_configs: userHome.Configs = {
  profileInfoPrimaryMsgSchemaConfigs: {
    aboutMe: { max: 500 },
    displayName: { min: 3, max: 60, regex: null },
    location: { max: 300 },
    siteUrl: { max: 2048 },
  },
}
