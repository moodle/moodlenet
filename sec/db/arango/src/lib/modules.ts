import { _any } from '@moodle/lib-types'
import assert from 'assert'
import { db_struct } from '../db-structure'
import { ModConfigs, modConfigName } from '@moodle/domain'
import { Document } from 'arangojs/documents'

export async function getModConfigs<mod extends modConfigName>({
  db_struct,
  moduleName,
}: {
  db_struct: db_struct
  moduleName: mod
}) {
  const configs = await db_struct.mng.coll.module_configs.document(moduleName)
  assert(configs, new Error(`config for module ${moduleName} not found`))
  return { configs } as unknown as { configs: Document<ModConfigs[mod]> }
}

export async function saveModConfigs<mod extends modConfigName>({
  db_struct,
  moduleName,
  configs,
}: {
  db_struct: db_struct
  moduleName: mod
  configs: ModConfigs[mod]
}) {
  const result = await db_struct.mng.coll.module_configs.save(
    { _key: moduleName, ...configs },
    { overwriteMode: 'replace' },
  )
  return !!result
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
