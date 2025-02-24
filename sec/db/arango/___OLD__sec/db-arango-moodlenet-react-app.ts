import { modConfigName, secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { moodlenetCategories } from '@moodle/module/moodlenet-react-app'
import { aql } from 'arangojs'
import assert from 'assert'
import { dbStruct } from '../db-structure'

export function moodlenet_react_app_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return (/* secondaryCtx */) => {
    const secondaryAdapter: secondaryAdapter = {
      moodlenetReactApp: {
        query: {
          async moodlenetCategories() {
            const eduModuleConfigKey: modConfigName = 'edu'
            const [moodlenetCategories] = await (
              await dbStruct.appData.db.query<moodlenetCategories>(aql`
              LET eduAppConfigs = Document(${dbStruct.appData.coll.moduleConfigs},${eduModuleConfigKey})

              RETURN {
                eduBloomCognitives: (
                  FOR eduBloomCognitive IN eduAppConfigs.enabledCategories.eduBloomCognitives.enabled
                    RETURN MOODLE::RESTORE_RECORD_ID(Document(${dbStruct.appData.coll.eduBloomCognitive},eduBloomCognitive.level))
              ),

                eduIscedFields: (
                  FOR eduIscedField IN eduAppConfigs.enabledCategories.eduIscedFields.enabled
                    RETURN MOODLE::RESTORE_RECORD_ID(Document(${dbStruct.appData.coll.eduIscedField},eduIscedField.code))
              ),

                eduIscedLevels: (
                  FOR eduIscedLevel IN eduAppConfigs.enabledCategories.eduIscedLevels.enabled
                    RETURN MOODLE::RESTORE_RECORD_ID(Document(${dbStruct.appData.coll.eduIscedLevel},eduIscedLevel.code))
              ),
                eduResourceTypes: (
                  FOR eduResourceType IN eduAppConfigs.enabledCategories.eduResourceTypes.enabled
                    RETURN MOODLE::RESTORE_RECORD_ID(Document(${dbStruct.appData.coll.eduResourceType},eduResourceType.code))
              ),
                contentLanguages: (
                  FOR contentLanguage IN eduAppConfigs.enabledCategories.contentLanguages.enabled
                    RETURN MOODLE::RESTORE_RECORD_ID(Document(${dbStruct.appData.coll.contentLanguage},contentLanguage.code))
              ),

                contentLicenses: (
                  FOR contentLicense IN eduAppConfigs.enabledCategories.contentLicenses.enabled
                    RETURN MOODLE::RESTORE_RECORD_ID(Document(${dbStruct.appData.coll.contentLicense},contentLicense.code))
                ),
}
            `)
            ).all()
            assert(moodlenetCategories, new Error('could not aggregate moodlenetCategories'))
            return { moodlenetCategories }
          },
        },
      },
    }
    return secondaryAdapter
  }
}
