import { contentLanguages_iso_639_3_Setup, contentLicensesSetup } from '@moodle/module/content/setup'
import {
  eduBloomCognitivesSetup,
  eduIscedFieldsSetup,
  eduIscedLevelsSetup,
  eduResourceTypesSetup,
} from '@moodle/module/edu/setup'
import { dbStruct } from '../../../db-structure'
import { contentLanguageRecord2contentLanguageDocument, contentLicenseRecord2contentLicenseDocument } from '../../../sec/content-db'
import { eduBloomCognitiveRecord2eduBloomCognitiveDocument, eduIscedFieldRecord2eduIscedFieldDocument, eduIscedLevelRecord2eduIscedLevelDocument, eduResourceTypeRecord2eduResourceTypeDocument } from '../../../sec/edu-db'
// import { removePropOnInsert } from '../lib/id'

export async function insertInitialData({ dbStruct }: { dbStruct: dbStruct }) {
  await dbStruct.data.coll.contentLanguage.saveAll(contentLanguages_iso_639_3_Setup.map(contentLanguageRecord2contentLanguageDocument))
  await dbStruct.data.coll.contentLicense.saveAll(contentLicensesSetup.map(contentLicenseRecord2contentLicenseDocument))
  await dbStruct.data.coll.eduBloomCognitive.saveAll(eduBloomCognitivesSetup.map(eduBloomCognitiveRecord2eduBloomCognitiveDocument))
  await dbStruct.data.coll.eduIscedField.saveAll(eduIscedFieldsSetup.map(eduIscedFieldRecord2eduIscedFieldDocument))
  await dbStruct.data.coll.eduIscedLevel.saveAll(eduIscedLevelsSetup.map(eduIscedLevelRecord2eduIscedLevelDocument))
  await dbStruct.data.coll.eduResourceType.saveAll(eduResourceTypesSetup.map(eduResourceTypeRecord2eduResourceTypeDocument))
}
