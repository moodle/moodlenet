import { composeImpl, factory } from '@moodle/core'
import { eml_pwd_auth, iam, net } from './sec/moodle'
import { Config } from 'arangojs/connection'
import { SessionCtx } from './session-ctx'
import struct_0_1, { dbs_struct_configs_0_1 } from './dbStructure/0_1'
export interface ArangoPersistenceEnv {
  data_db_config: Config
  iam_db_config: Config
}

export function get_arango_persistence_factory({
  dbs_struct_configs_0_1,
}: {
  dbs_struct_configs_0_1: dbs_struct_configs_0_1
}): factory<'sec'> {
  const db_struct_0_1 = struct_0_1(dbs_struct_configs_0_1)
  return function factory(ctx) {
    return SessionCtx.run({ db_struct_0_1 }, () => {
      return composeImpl(net()(ctx), eml_pwd_auth()(ctx), iam()(ctx))
    })
  }
}

