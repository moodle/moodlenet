import { fetchAllSchemaConfigs, makeAllPrimarySchemas } from '@moodle/domain/lib'
import { access } from './session-access'

export async function getAllPrimarySchemas() {
  const allSchemaConfigs = await fetchAllSchemaConfigs({ primary: access.primary })
  return makeAllPrimarySchemas(allSchemaConfigs)
}
