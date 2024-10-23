import { contentLanguageRecord, contentLicenseRecord } from 'domain/src/modules/content'
import { id_to_key } from '../../types'

export type contentLicenseDocument = id_to_key<contentLicenseRecord>
export type contentLanguageDocument = id_to_key<contentLanguageRecord>
