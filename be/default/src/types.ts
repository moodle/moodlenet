import { moodle_core_factory, moodle_secondary_factory } from '@moodle/domain'
import { access_session, domain_msg, domain_session_access } from '@moodle/lib-ddd'

export type ConfiguratorDeps = {
  access_session: access_session
}

export type configurator = (_: ConfiguratorDeps) => Promise<Configuration>
export interface Configuration {
  core_factories: moodle_core_factory[]
  secondary_factories: moodle_secondary_factory[]
}
export type session_deployer = (_: SessionDeploymentDeps) => Promise<any>
export type SessionDeploymentDeps = {
  access_session: access_session
  domain_msg: domain_msg
  core_factories: moodle_core_factory[]
  secondary_factories: moodle_secondary_factory[]
}

export type BinderDeps = { domain_session_access: domain_session_access }

export type Binder = (_: BinderDeps) => void
