import { logger } from '../../../../../../types'
import { DEFAULT_ACCESS_CONTROL_CONFIGS } from '../../../../../model/accessControl.model/setup'
import { DEFAULT_EDUCATION_CONFIGS } from '../../../../../model/education.model/setup/configs'
import { DEFAULT_MOODLENET_CONFIGS } from '../../../../../model/moodlenet.model/setup'
import { DEFAULT_ORG_CONFIGS } from '../../../../../model/org.model/setup'
import { DEFAULT_USER_ACCOUNT_CONFIGS } from '../../../../../model/userAccount.model/setup'

export async function insertModConfigs({ model, log }: { model: moo.model.handle; log: logger }) {
  // await model.configs.module.accessControl).eplace.sync({ newData: DEFAULT_ACCESS_CONTROL_CONFIGS })
  // await model.configs.module.content).eplace.sync({ newData: DEFAULT_CONTENT_CONFIGS })
  // await model.configs.module.crypto).eplace.sync({ newData: DEFAULT_CRYPTO_CONFIGS })
  // await model.configs.module.jwtTokens).eplace.sync({ newData: DEFAULT_JWT_TOKENS_CONFIGS })
  // await model.configs.module.mailer).eplace.sync({ newData: DEFAULT_MAILER_CONFIGS })
  log.info('inserting module configs')
  await Promise.all([
    model.configs.model.education.put.sync({ newData: DEFAULT_EDUCATION_CONFIGS }),
    model.configs.model.moodlenet.put.sync({ newData: DEFAULT_MOODLENET_CONFIGS }),
    model.configs.model.org.put.sync({ newData: DEFAULT_ORG_CONFIGS }),
    model.configs.model.userAccount.put.sync({ newData: DEFAULT_USER_ACCOUNT_CONFIGS }),
    model.configs.model.accessControl.put.sync({ newData: DEFAULT_ACCESS_CONTROL_CONFIGS }),
  ])
}
