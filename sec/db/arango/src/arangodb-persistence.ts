import { composeImpl, sec_factory } from '@moodle/domain'
import struct_0_1 from './dbStructure/v0_1'
import { iam, net, netWebappNextjs } from './sec/moodle'
import { ArangoDbSecEnv } from './types'

export function get_arango_persistence_factory({
  dbs_struct_configs_0_1,
}: ArangoDbSecEnv): sec_factory {
  const db_struct_0_1 = struct_0_1(dbs_struct_configs_0_1)
  return function factory(ctx) {
    return composeImpl(
      net({ db_struct_0_1 })(ctx),
      iam({ db_struct_0_1 })(ctx),
      netWebappNextjs({ db_struct_0_1 })(ctx),
    )
  }
}
