import { net } from '@moodle/domain'

export const net_default_configs: net.Configs = {
  info: {
    title: 'Search for resources, subjects, collections or people',
    subtitle: 'Find, share and curate open educational resources',
  },
  moodleNetPrimaryMsgSchemaConfigs: {
    info: {
      subtitle: { max: 200, min: 3 },
      title: { max: 100, min: 3 },
    },
  },
}
