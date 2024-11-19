import { configs } from '../types'

export const edu_default_configs: configs = {
  eduPrimaryMsgSchemaConfigs: {
    eduCollectionMeta: {
      description: { max: 5000 },
      title: { max: 150 },
    },
    eduResourceMeta: {
      description: { max: 5000 },
      title: { max: 150 },
    },
  },
}
