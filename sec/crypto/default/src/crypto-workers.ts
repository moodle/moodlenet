import { composeImpl, sec_factory } from '@moodle/domain'
import { joseEnv } from '@moodle/lib-jwt-jose'
import { Config } from 'arangojs/connection'
import { ArgonPwdHashOpts, iam } from './sec/moodle'
export interface ArangoPersistenceEnv {
  data_db_config: Config
  iam_db_config: Config
}

export function get_default_crypto_workers_factory({
  joseEnv,
  argonOpts,
}: {
  joseEnv: joseEnv
  argonOpts: ArgonPwdHashOpts
}): sec_factory {
  return function factory(ctx) {
    return composeImpl(iam({ joseEnv, argonOpts })(ctx))
  }
}
