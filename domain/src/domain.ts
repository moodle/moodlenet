import * as mod from './mod'
import { CoreContext } from './types/core-context'

export interface MoodleDomain {
  version: '5.0'
  modules: Modules
}

export interface Modules {
  moodle: {
    net: mod.moodle.net.module
    iam: mod.moodle.iam.module
    eml_pwd_auth: mod.moodle.eml_pwd_auth.module
  }
}

export function coreDomain(coreContext: CoreContext): MoodleDomain {
  return {
    version: '5.0',
    modules: {
      moodle: {
        eml_pwd_auth: mod.moodle.eml_pwd_auth.core(coreContext),
        net: mod.moodle.net.core(coreContext),
        iam: mod.moodle.iam.core(coreContext),
      },
    },
  }
}
