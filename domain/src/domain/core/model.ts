import { map } from '@moodle/lib-types'
import { accessControlCore } from '../model/accessControl.model/accessControl.core'
// import {configsCore } from '../configs.model/configs.core'
// import { contentCore } from '../model/content.model/content.core'
// import {cryptoCore } from '../crypto.model/crypto.core'
// import {educationCore } from '../education.model/education.core'
import { homeCore } from '../model/home.model/home.core'
// import {signedTokensCore } from '../signedTokens.model/signedTokens.core'
// import {mailerCore } from '../mailer.model/mailer.core'
import { moderationCore } from '../model/moderation.model/moderation.core'
import { moodlenetCore } from '../model/moodlenet.model/moodlenet.core'
// import {orgCore } from '../org.model/org.core'
// import {userHomeCore } from '../userHome.model/userHome.core'

export const cores = {
  accessControlCore,
  homeCore,
  moderationCore,
  moodlenetCore,
} satisfies map<moo.def.model.impl>
