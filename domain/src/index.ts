import {
  core_factory,
  core_impl,
  CoreContext,
  ddd,
  DeploymentInfo,
  secondary_adapter,
  secondary_factory,
  SecondaryContext,
} from '@moodle/lib-ddd'
import { _maybe, email_address } from '@moodle/lib-types'
import { iam_event, iam_primary, iam_secondary } from './iam'
import { net_primary, net_secondary } from './net'
import { net_webapp_nextjs_primary, net_webapp_nextjs_secondary } from './netWebappNextjs'
import { org_primary, org_secondary } from './org'
import { storage_primary, storage_secondary } from './storage'

export * as iam from './iam'
export * as net from './net'
export * as netWebappNextjs from './netWebappNextjs'
export * as org from './org'

export type sys_admin_info = { email: email_address }
export type moodle_domain = ddd<
  {
    org: org_primary
    iam: iam_primary
    net: net_primary
    netWebappNextjs: net_webapp_nextjs_primary
    storage: storage_primary
    env: {
      application: {
        deployment(_: {
          app: 'moodlenet-webapp' | 'filestore-http'
        }): Promise<_maybe<DeploymentInfo>>
        fsHomeDir(): Promise<{ path: string }>
      }
      maintainance: {
        getSysAdminInfo(): Promise<sys_admin_info>
      }
    }
  },
  {
    org: org_secondary
    iam: iam_secondary
    net: net_secondary
    netWebappNextjs: net_webapp_nextjs_secondary
    storage: storage_secondary
  },
  {
    iam: iam_event
    env: {
      system: {
        // BEWARE:this message is currently invoked manually (type-unchecked) in be/default/src/default-session-deployment.ts
        backgroundProcess(_: { action: 'start' | 'stop' }): Promise<unknown>
      }
    }
  }
>

export type moodle_core_context = CoreContext<moodle_domain>
export type moodle_core_factory = core_factory<moodle_domain>
export type moodle_core_impl = core_impl<moodle_domain>
export type moodle_secondary_context = SecondaryContext<moodle_domain>
export type moodle_secondary_factory = secondary_factory<moodle_domain>
export type moodle_secondary_adapter = secondary_adapter<moodle_domain>
