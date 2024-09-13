import { composeImpl, sec_factory } from '@moodle/domain'
import struct_v1_0 from './dbStructure/v1_0'
import { iam, net, netWebappNextjs } from './sec/moodle'
import { ArangoDbSecEnv } from './types'

export function get_arango_persistence_factory({
  dbs_struct_configs_v1_0,
}: ArangoDbSecEnv): sec_factory {
  const db_struct_v1_0 = struct_v1_0(dbs_struct_configs_v1_0)
  return function factory(ctx) {
    return composeImpl(
      net({ db_struct_v1_0 })(ctx),
      iam({ db_struct_v1_0 })(ctx),
      netWebappNextjs({ db_struct_v1_0 })(ctx),
    )
  }
}
