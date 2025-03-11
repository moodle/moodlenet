import { logger } from '../../../../../../types'
import { DEFAULT_ACCESS_CONTROL_CONFIGS } from '../../../../../model/accessControl.model/setup'
import { DEFAULT_EDUCATION_SCHEMAS } from '../../../../../model/education.model/setup/configs'
import { DEFAULT_MOODLENET_CONFIGS, DEFAULT_MOODLENET_SCHEMAS } from '../../../../../model/moodlenet.model/setup'
import { DEFAULT_ORG_CONFIGS, DEFAULT_ORG_SCHEMAS } from '../../../../../model/org.model/setup'
import { DEFAULT_USER_ACCOUNT_CONFIGS, DEFAULT_USER_ACCOUNT_SCHEMAS } from '../../../../../model/userAccount.model/setup'

export async function insertModStatics({ model, log }: { model: moo.model.handle; log: logger }) {
  // await model.configs.module.accessControl).eplace.sync({ newData: DEFAULT_ACCESS_CONTROL_CONFIGS })
  // await model.configs.module.content).eplace.sync({ newData: DEFAULT_CONTENT_CONFIGS })
  // await model.configs.module.crypto).eplace.sync({ newData: DEFAULT_CRYPTO_CONFIGS })
  // await model.configs.module.jwtTokens).eplace.sync({ newData: DEFAULT_JWT_TOKENS_CONFIGS })
  // await model.configs.module.mailer).eplace.sync({ newData: DEFAULT_MAILER_CONFIGS })
  log.info('inserting module statics')
  await Promise.all([
    model.statics.data.ns.put.sync({ kind: 'schemas', ns: 'education', data: DEFAULT_EDUCATION_SCHEMAS }),
    model.statics.data.ns.put.sync({ kind: 'schemas', ns: 'moodlenet', data: DEFAULT_MOODLENET_SCHEMAS }),
    model.statics.data.ns.put.sync({ kind: 'configs', ns: 'moodlenet', data: DEFAULT_MOODLENET_CONFIGS }),
    model.statics.data.ns.put.sync({ kind: 'schemas', ns: 'org', data: DEFAULT_ORG_SCHEMAS }),
    model.statics.data.ns.put.sync({ kind: 'configs', ns: 'org', data: DEFAULT_ORG_CONFIGS }),
    model.statics.data.ns.put.sync({ kind: 'configs', ns: 'userAccount', data: DEFAULT_USER_ACCOUNT_CONFIGS }),
    model.statics.data.ns.put.sync({ kind: 'schemas', ns: 'userAccount', data: DEFAULT_USER_ACCOUNT_SCHEMAS }),
    model.statics.data.ns.put.sync({ kind: 'configs', ns: 'accessControl', data: DEFAULT_ACCESS_CONTROL_CONFIGS }),
  ])
}
