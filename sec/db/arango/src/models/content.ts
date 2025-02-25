import { content } from '@moodle/domain/model'
import { dbStruct } from '../db-structure'

export function contentImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<content.contentModel> {
  return {
    categories: {
      languages: {
        '#': _key => ({}),
        '* bulkCreate': async ({ spaces }) => {
          await dbStruct.appData.coll.contentLanguage.saveAll(
            spaces.map(({ id, data }) => ({ _key: id, edu: data })),
            { silent: true, overwriteMode: 'replace' },
          )
        },
      },
      licenses: {
        '#': _key => ({}),
        '* bulkCreate': async ({ spaces }) => {
          await dbStruct.appData.coll.contentLicense.saveAll(
            spaces.map(({ id, data }) => ({ _key: id, edu: data })),
            { silent: true, overwriteMode: 'replace' },
          )
        },
      },
    },
  }
}
