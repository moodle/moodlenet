import { education } from '@moodle/domain/model'
import { dbStruct } from '../db-structure'

export function educationImpl({ dbStruct }: { dbStruct: dbStruct }): moo.def.model.impl<education.educationModel> {
  return {
    categories: {
      bloomCognitives: {
        create: {
          exe: (/*ctx*/) =>
            async ({ record }) => {
              await dbStruct.appData.coll.eduBloomCognitive.save({ _key: String(record.data.level), education: record }, { silent: true, overwriteMode: 'conflict' })
            },
        },
      },
      iscedFields: {
        create: {
          exe: (/*ctx*/) =>
            async ({ record }) => {
              await dbStruct.appData.coll.eduIscedField.save({ _key: record.data.code, education: record }, { silent: true, overwriteMode: 'conflict' })
            },
        },
      },
      iscedLevels: {
        create: {
          exe: (/*ctx*/) =>
            async ({ record }) => {
              await dbStruct.appData.coll.eduIscedLevel.save({ _key: record.data.code, education: record }, { silent: true, overwriteMode: 'conflict' })
            },
        },
      },
      resourceTypes: {
        create: {
          exe: (/*ctx*/) =>
            async ({ record }) => {
              await dbStruct.appData.coll.eduResourceType.save({ _key: record.data.code, education: record }, { silent: true, overwriteMode: 'conflict' })
            },
        },
      },
    },
  }
}
