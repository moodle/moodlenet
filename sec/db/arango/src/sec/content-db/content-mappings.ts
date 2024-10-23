import { contentLanguageRecord, contentLicenseRecord } from 'domain/src/modules/content'
import { id_to_key, key_to_id } from '../../lib/mapping'
import { contentLanguageDocument, contentLicenseDocument } from './content-types'

export const contentLicenseDocument2contentLicenseRecord = key_to_id<contentLicenseDocument>
export const contentLanguageDocument2contentLanguageRecord = key_to_id<contentLanguageDocument>

export const contentLicenseRecord2contentLicenseDocument = id_to_key<contentLicenseRecord>
export const contentLanguageRecord2contentLanguageDocument = id_to_key<contentLanguageRecord>
