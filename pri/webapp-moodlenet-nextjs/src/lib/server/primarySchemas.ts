import { fetchAllSchemaConfigs, makeAllPrimarySchemas } from '@moodle/domain/lib'
import { primary } from './session-access'

export async function getAllPrimarySchemas() {
  const allSchemaConfigs = await fetchAllSchemaConfigs({ primary: primary.moodle })
  return makeAllPrimarySchemas(allSchemaConfigs)
}
