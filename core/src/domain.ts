import * as mod from './mod'

export interface MoodleDomain {
  version: '5.0'
  modules: Modules
}

export interface MoodleMods {
  iam: mod.moodle.iam.module
  eml_pwd_auth: mod.moodle.eml_pwd_auth.module
  net: mod.moodle.net.module
}

export interface Modules {
  moodle: MoodleMods
}
