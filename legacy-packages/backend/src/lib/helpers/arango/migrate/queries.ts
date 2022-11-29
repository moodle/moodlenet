import { aq, aqlstr } from '../query'
import { MigrationRecord, Version } from './types'

export const MIGRATIONS_COLLECTION = 'DB_MIGRATIONS'

export const getMigrationHistoryQ = () =>
  aq<MigrationRecord<Version> | null>(`
  for migr in ${MIGRATIONS_COLLECTION}
  sort migr.date desc
  return migr
`)

export const addMigrationRecordQ = (record: MigrationRecord<Version>) =>
  aq<MigrationRecord<Version>>(`
  insert ${aqlstr(record)} in ${MIGRATIONS_COLLECTION}
  return NEW
`)
