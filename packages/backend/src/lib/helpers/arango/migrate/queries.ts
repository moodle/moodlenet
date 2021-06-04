import { aqlstr } from '../../arango'
import { MigrationRecord } from './types'

export const MIGRATIONS_COLLECTION = 'MIGRATIONS_COLLECTION'

export const getMigrationHistoryQ = () => `
  for migr in ${MIGRATIONS_COLLECTION}
  sort migr.date desc
  return migr
`

export const addMigrationRecordQ = (record: MigrationRecord) => `
  insert ${aqlstr(record)} in ${MIGRATIONS_COLLECTION}
  return NEW
`
