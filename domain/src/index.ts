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
import { _maybe } from '@moodle/lib-types'
import { iam_event, iam_primary, iam_secondary } from './iam'
import { net_primary, net_secondary } from './net'
import { net_webapp_nextjs_primary, net_webapp_nextjs_secondary } from './netWebappNextjs'
import { org_primary, org_secondary } from './org'

export * as iam from './iam'
export * as net from './net'
export * as netWebappNextjs from './netWebappNextjs'
export * as org from './org'

export type moodle_domain = ddd<
  {
    org: org_primary
    iam: iam_primary
    net: net_primary
    netWebappNextjs: net_webapp_nextjs_primary
    env: {
      deployments: {
        info(app: 'moodlenet'): Promise<_maybe<DeploymentInfo>>
      }
    }
  },
  {
    org: org_secondary
    iam: iam_secondary
    net: net_secondary
    netWebappNextjs: net_webapp_nextjs_secondary
  },
  {
    iam: iam_event
  }
>

export type moodle_core_context = CoreContext<moodle_domain>
export type moodle_core_factory = core_factory<moodle_domain>
export type moodle_core_impl = core_impl<moodle_domain>
export type moodle_secondary_context = SecondaryContext<moodle_domain>
export type moodle_secondary_factory = secondary_factory<moodle_domain>
export type moodle_secondary_adapter = secondary_adapter<moodle_domain>
