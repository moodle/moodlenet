import { eduBloomCognitiveRecord, eduIscedFieldRecord, eduIscedLevelRecord, eduResourceTypeRecord } from '@moodle/module/edu'
import { id_to_key, key_to_id } from '../../lib/mapping'
import {
  eduBloomCognitiveDocument,
  eduIscedFieldDocument,
  eduIscedLevelDocument,
  eduResourceTypeDocument,
} from './edu-types'

export const eduIscedFieldDocument2eduIscedFieldRecord = key_to_id<eduIscedFieldDocument>
export const eduIscedLevelDocument2eduIscedLevelRecord = key_to_id<eduIscedLevelDocument>
export const eduBloomCognitiveDocument2eduBloomCognitiveRecord = key_to_id<eduBloomCognitiveDocument>
export const eduResourceTypeDocument2eduResourceTypeRecord = key_to_id<eduResourceTypeDocument>

export const eduIscedFieldRecord2eduIscedFieldDocument = id_to_key<eduIscedFieldRecord>
export const eduIscedLevelRecord2eduIscedLevelDocument = id_to_key<eduIscedLevelRecord>
export const eduBloomCognitiveRecord2eduBloomCognitiveDocument = id_to_key<eduBloomCognitiveRecord>
export const eduResourceTypeRecord2eduResourceTypeDocument = id_to_key<eduResourceTypeRecord>
