import { content } from '@moodle/domain/model'
import { dbStruct } from '../db-structure'

export function contentImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<content.contentModel> {
  return {
    categories: {
      languages: {
        _: code => ({
          $: {
            create: {
              exe: async ({ spaceData }) => {
                await dbStruct.appData.coll.contentLanguage.save({ _key: code, content: spaceData }, { silent: true, overwriteMode: 'conflict' })
              },
            },
          },
        }),
      },
      licenses: {
        _: code => ({
          $: {
            create: {
              exe: async ({ spaceData }) => {
                await dbStruct.appData.coll.contentLicense.save({ _key: code, content: spaceData }, { silent: true, overwriteMode: 'conflict' })
              },
            },
          },
        }),
      },
    },
  }
}
