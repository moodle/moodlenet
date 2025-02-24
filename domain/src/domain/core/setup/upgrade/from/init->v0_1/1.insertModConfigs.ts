import { DEFAULT_EDUCATION_CONFIGS } from '../../../../../model/education.model/setup/configs'
import { DEFAULT_MOODLENET_CONFIGS } from '../../../../../model/moodlenet.model/setup'
import { DEFAULT_ORG_CONFIGS } from '../../../../../model/org.model/setup'
import { DEFAULT_USER_ACCOUNT_CONFIGS } from '../../../../../model/userAccount.model/setup'

export async function insertModConfigs({ handle }: { handle: moo.model.handle }) {
  // await handle.over(handle.model.configs.module.accessControl).replace.sync({ newData: DEFAULT_ACCESS_CONTROL_CONFIGS })
  // await handle.over(handle.model.configs.module.content).replace.sync({ newData: DEFAULT_CONTENT_CONFIGS })
  // await handle.over(handle.model.configs.module.crypto).replace.sync({ newData: DEFAULT_CRYPTO_CONFIGS })
  // await handle.over(handle.model.configs.module.jwtTokens).replace.sync({ newData: DEFAULT_JWT_TOKENS_CONFIGS })
  // await handle.over(handle.model.configs.module.mailer).replace.sync({ newData: DEFAULT_MAILER_CONFIGS })
  await handle.over(handle.model.configs.module.education).replace.sync({ newData: DEFAULT_EDUCATION_CONFIGS })
  await handle.over(handle.model.configs.module.moodlenet).replace.sync({ newData: DEFAULT_MOODLENET_CONFIGS })
  await handle.over(handle.model.configs.module.org).replace.sync({ newData: DEFAULT_ORG_CONFIGS })
  await handle.over(handle.model.configs.module.userAccount).replace.sync({ newData: DEFAULT_USER_ACCOUNT_CONFIGS })
}
