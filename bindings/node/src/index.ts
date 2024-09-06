import { domain_msg, mod_id, PrimarySession } from '@moodle/core'
export * as http_bind from './http'

// FIXME TransportData  is generic for any binding (?)
export interface TransportData {
  primarySession: PrimarySession
  domain_msg: domain_msg
  core_mod_id: mod_id | null
}
