import { _any } from '@moodle/lib-types'
import assert from 'assert'
import { dbStruct } from '../db-structure'
import { ModConfigs, modConfigName } from '@moodle/domain'
import { Document } from 'arangojs/documents'

export async function getModConfigs<mod extends modConfigName>({ dbStruct, moduleName }: { dbStruct: dbStruct; moduleName: mod }) {
  const configs = await dbStruct.modules.coll.moduleConfigs.document(moduleName)
  assert(configs, new Error(`config for module ${moduleName} not found`))
  return { configs } as unknown as { configs: Document<ModConfigs[mod]> }
}

export async function saveModConfigs<mod extends modConfigName>({
  dbStruct,
  moduleName,
  configs,
}: {
  dbStruct: dbStruct
  moduleName: mod
  configs: ModConfigs[mod]
}) {
  const result = await dbStruct.modules.coll.moduleConfigs.save(
    { _key: moduleName, ...configs },
    { overwriteMode: 'replace' },
  )
  return !!result
}

export async function updateDeepPartialModConfigs({
  dbStruct,
  moduleName,
  partialConfigs,
}: {
  dbStruct: dbStruct
  moduleName: string
  partialConfigs: _any
}) {
  const result = await dbStruct.modules.coll.moduleConfigs.update({ _key: moduleName }, partialConfigs, { returnNew: true })

  return result
}
