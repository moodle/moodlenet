import assert from 'assert'
import { db_struct_0_1 } from '../dbStructure/0_1'

export async function getModConfigs({
  db_struct_0_1,
  mod_int_id,
}: {
  db_struct_0_1: db_struct_0_1
  mod_int_id: string
}) {
  const configs = await db_struct_0_1.mng.coll.module_configs.document(mod_int_id)
  assert(configs, new Error(`${mod_int_id} config not found`))
  return configs
}
