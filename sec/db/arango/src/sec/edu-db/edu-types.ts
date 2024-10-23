import { eduBloomCognitiveRecord, eduIscedFieldRecord, eduIscedLevelRecord, eduResourceTypeRecord } from '@moodle/module/edu'
import { id_to_key } from '../../types'

export type eduIscedFieldDocument = id_to_key<eduIscedFieldRecord>
export type eduIscedLevelDocument = id_to_key<eduIscedLevelRecord>
export type eduBloomCognitiveDocument = id_to_key<eduBloomCognitiveRecord>
export type eduResourceTypeDocument = id_to_key<eduResourceTypeRecord>
