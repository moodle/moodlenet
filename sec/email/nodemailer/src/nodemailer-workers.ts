import { composeImpl, sec_factory } from '@moodle/domain'
import { Config } from 'arangojs/connection'
import { iam } from './sec/moodle'
import { Env } from './types'
export interface ArangoPersistenceEnv {
  data_db_config: Config
  iam_db_config: Config
}

export function get_nodemailer_workers_factory({ env }: { env: Env }): sec_factory {
  return function factory(ctx) {
    return composeImpl(iam({ env })(ctx))
  }
}
