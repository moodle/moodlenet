import { content } from '@moodle/domain/model'
import { dbStruct } from '../db-structure'

export function contentImpl({ dbStruct }: { dbStruct: dbStruct }): moo.def.model.impl<content.contentModel> {
  return {
    categories: {
      languages: {
        create: {
          exe: (/*ctx*/) =>
            async ({ record }) => {
              await dbStruct.appData.coll.contentLanguage.save({ _key: record.data.code, content: record }, { silent: true, overwriteMode: 'conflict' })
            },
        },
      },
      licenses: {
        create: {
          exe: (/*ctx*/) =>
            async ({ record }) => {
              await dbStruct.appData.coll.contentLicense.save({ _key: record.data.code, content: record }, { silent: true, overwriteMode: 'conflict' })
            },
        },
      },
    },
  }
}
