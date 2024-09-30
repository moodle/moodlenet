import { domain_endpoint } from '@moodle/lib-ddd'
import { _any } from '@moodle/lib-types'
import assert from 'assert'
import { db_struct } from '../db-structure'

function getKey(domain_endpoint: domain_endpoint) {
  return domain_endpoint.module
}

export async function getModConfigs({
  db_struct,
  domain_endpoint,
}: {
  db_struct: db_struct
  domain_endpoint: domain_endpoint
}) {
  const mod_int_id = getKey(domain_endpoint)
  const configs = await db_struct.mng.coll.module_configs.document(mod_int_id)
  assert(configs, new Error(`${mod_int_id} config not found`))
  return { configs }
}

export async function saveModConfigs({
  db_struct,
  domain_endpoint,
  configs,
}: {
  db_struct: db_struct
  domain_endpoint: domain_endpoint
  configs: _any
}) {
  const mod_int_id = getKey(domain_endpoint)
  const result = await db_struct.mng.coll.module_configs.save(
    { _key: mod_int_id, ...configs },
    { overwriteMode: 'replace' },
  )
  return result
}

export async function updateDeepPartialModConfigs({
  db_struct,
  domain_endpoint,
  partialConfigs,
}: {
  db_struct: db_struct
  domain_endpoint: domain_endpoint
  partialConfigs: _any
}) {
  const mod_int_id = getKey(domain_endpoint)
  const result = await db_struct.mng.coll.module_configs.update(
    { _key: mod_int_id },
    partialConfigs,
    { silent: true },
  )
  return result
}
