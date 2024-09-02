import { composeImpl, factory } from '@moodle/domain'
import { ArangoDBSecEnv } from './types/env'
import { eml_pwd_auth, iam, net } from './workers/moodle'

export function db_sec_arango(_: ArangoDBSecEnv): factory<'sec'> {
  return ctx => {
    return composeImpl(net(_)(ctx), eml_pwd_auth(_)(ctx), iam(_)(ctx))
  }
}
