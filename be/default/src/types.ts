import {
  access_session,
  core_factory,
  domain_msg,
  domain_session_access,
  sec_factory,
} from '@moodle/lib-ddd'

export type ConfiguratorDeps = {
  access_session: access_session
}

export type configurator = (_: ConfiguratorDeps) => Promise<Configuration>
export interface Configuration {
  core_factories: core_factory[]
  sec_factories: sec_factory[]
}
export type session_deployer = (_: SessionDeploymentDeps) => Promise<any>
export type SessionDeploymentDeps = {
  access_session: access_session
  domain_msg: domain_msg
  core_factories: core_factory[]
  sec_factories: sec_factory[]
}

export type BinderDeps = { domain_session_access: domain_session_access }

export type Binder = (_: BinderDeps) => void
