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
  await dbStruct.appData.coll.contentLanguage.saveAll(contentLanguages_iso_639_3_Setup.map(save_id_to_key('code')))
  await dbStruct.appData.coll.contentLicense.saveAll(contentLicensesSetup.map(save_id_to_key('code')))
  await dbStruct.appData.coll.eduBloomCognitive.saveAll(eduBloomCognitivesSetup.map(save_id_to_key('level')))
  await dbStruct.appData.coll.eduIscedField.saveAll(eduIscedFieldsSetup.map(save_id_to_key('code')))
  await dbStruct.appData.coll.eduIscedLevel.saveAll(eduIscedLevelsSetup.map(save_id_to_key('code')))
  await dbStruct.appData.coll.eduResourceType.saveAll(eduResourceTypesSetup.map(save_id_to_key('code')))
}
