import { _any } from '@moodle/lib-types'
import assert from 'assert'
import { db_struct } from '../db-structure'

export async function getModConfigs({
  db_struct,
  moduleName,
}: {
  db_struct: db_struct
  moduleName: string
}) {
  const configs = await db_struct.mng.coll.module_configs.document(moduleName)
  assert(configs, new Error(`config for module ${moduleName} not found`))
  return { configs }
}

export async function saveModConfigs({
  db_struct,
  moduleName,
  configs,
}: {
  db_struct: db_struct
  moduleName: string
  configs: _any
}) {
  const result = await db_struct.mng.coll.module_configs.save(
    { _key: moduleName, ...configs },
    { overwriteMode: 'replace' },
  )
  return result
}

export async function updateDeepPartialModConfigs({
  db_struct,
  moduleName,
  partialConfigs,
}: {
  db_struct: db_struct
  moduleName: string
  partialConfigs: _any
}) {
  const result = await db_struct.mng.coll.module_configs.update(
    { _key: moduleName },
    partialConfigs,
    { returnNew: true },
  )

  return result
}
