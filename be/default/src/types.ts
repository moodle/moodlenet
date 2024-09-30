import { moodle_core_factory, moodle_secondary_factory } from '@moodle/domain'
import { access_session, domain_msg, domain_session_access } from '@moodle/lib-ddd'

export type configurator_deps = {
  access_session: access_session
}

export type configurator = (_: configurator_deps) => Promise<configuration>
export type configuration = {
  core_factories: moodle_core_factory[]
  secondary_factories: moodle_secondary_factory[]
  start_background_processes: boolean
}
export type session_deployer = (_: session_deployment_deps) => Promise<unknown>
export type session_deployment_deps = {
  access_session: access_session
  domain_msg: domain_msg
  core_factories: moodle_core_factory[]
  secondary_factories: moodle_secondary_factory[]
  start_background_processes: boolean
}

export type binder_deps = { domain_session_access: domain_session_access }

export type binder = (_: binder_deps) => void
