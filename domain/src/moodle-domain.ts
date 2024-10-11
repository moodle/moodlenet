import {
  core_factory,
  core_impl,
  CoreContext,
  ddd,
  secondary_adapter,
  secondary_factory,
  SecondaryContext,
} from '@moodle/lib-ddd'
import { db_secondary } from './db'
import { env_primary } from './env'
import { moodle_app } from './env/types/app-deployments'
import { iam_primary, iam_secondary } from './iam'
import { net_primary } from './net'
import { net_webapp_nextjs_primary } from './netWebappNextjs'
import { org_primary } from './org'
import { storage_primary, storage_secondary } from './storage'
import { user_home_primary, user_home_secondary } from './userHome'

export type moodle_domain = ddd<
  {
    org: org_primary
    iam: iam_primary
    net: net_primary
    userHome: user_home_primary
    netWebappNextjs: net_webapp_nextjs_primary
    env: env_primary
    storage: storage_primary
  },
  {
    db: db_secondary
    iam: iam_secondary
    userHome: user_home_secondary
    storage: storage_secondary
  }
>

export type moodle_core_context = CoreContext<moodle_domain>
export type moodle_core_factory = core_factory<moodle_domain>
export type moodle_core_impl = core_impl<moodle_domain>
export type moodle_secondary_context = SecondaryContext<moodle_domain>
export type moodle_secondary_factory = secondary_factory<moodle_domain>
export type moodle_secondary_adapter = secondary_adapter<moodle_domain>

declare module '@moodle/lib-ddd' {
  export interface UserAccessSession {
    app: { name: moodle_app; version: string }
  }
}
