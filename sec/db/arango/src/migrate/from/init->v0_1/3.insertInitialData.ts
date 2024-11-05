import { contentLanguages_iso_639_3_Setup, contentLicensesSetup } from '@moodle/module/content/setup'
import {
  eduBloomCognitivesSetup,
  eduIscedFieldsSetup,
  eduIscedLevelsSetup,
  eduResourceTypesSetup,
} from '@moodle/module/edu/setup'
import { dbStruct } from '../../../db-structure'
import { save_id_to_key } from '../../../lib/key-id-mapping'
// import { removePropOnInsert } from '../lib/id'

export async function insertInitialData({ dbStruct }: { dbStruct: dbStruct }) {
  await dbStruct.moodlenet.coll.contentLanguage.saveAll(contentLanguages_iso_639_3_Setup.map(save_id_to_key))
  await dbStruct.moodlenet.coll.contentLicense.saveAll(contentLicensesSetup.map(save_id_to_key))
  await dbStruct.moodlenet.coll.eduBloomCognitive.saveAll(eduBloomCognitivesSetup.map(save_id_to_key))
  await dbStruct.moodlenet.coll.eduIscedField.saveAll(eduIscedFieldsSetup.map(save_id_to_key))
  await dbStruct.moodlenet.coll.eduIscedLevel.saveAll(eduIscedLevelsSetup.map(save_id_to_key))
  await dbStruct.moodlenet.coll.eduResourceType.saveAll(eduResourceTypesSetup.map(save_id_to_key))
}
