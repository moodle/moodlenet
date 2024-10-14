import { lib } from '@moodle/domain'
import { priAccess } from './session-access'

export async function getAllPrimarySchemas() {
  const allSchemaConfigs = await lib.fetchAllSchemaConfigs({ primary: priAccess() })
  return lib.makeAllPrimarySchemas(allSchemaConfigs)
}
