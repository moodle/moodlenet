import { fetchAllSchemaConfigs, makeAllPrimarySchemas } from '@moodle/domain'
import { priAccess } from './session-access'

export async function getAllPrimarySchemas() {
  const allSchemaConfigs = await fetchAllSchemaConfigs({ primary: priAccess() })
  return makeAllPrimarySchemas(allSchemaConfigs)
}
