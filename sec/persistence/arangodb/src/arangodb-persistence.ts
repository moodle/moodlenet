import { composeImpl, factory } from '@moodle/core'
import { eml_pwd_auth, iam, net } from './sec/moodle'
import { ArangoDBSecEnv } from './types/env'

export function db_sec_arango(_: ArangoDBSecEnv): factory<'sec'> {
  return ctx => {
    return composeImpl(net(_)(ctx), eml_pwd_auth(_)(ctx), iam(_)(ctx))
  }
}
