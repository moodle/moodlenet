import { education } from '@moodle/domain/model'
import { dbStruct } from '../db-structure'

export function educationImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<education.educationModel> {
  return {
    categories: {
      bloomCognitives: {
        _: code => ({
          $: {
            create: {
              exe: async ({ spaceData }) => {
                await dbStruct.appData.coll.eduBloomCognitive.save({ _key: code, education: spaceData }, { silent: true, overwriteMode: 'conflict' })
              },
            },
          },
        }),
      },
      iscedFields: {
        _: code => ({
          $: {
            create: {
              exe: async ({ spaceData }) => {
                await dbStruct.appData.coll.eduIscedField.save({ _key: code, education: spaceData }, { silent: true, overwriteMode: 'conflict' })
              },
            },
          },
        }),
      },
      iscedLevels: {
        _: code => ({
          $: {
            create: {
              exe: async ({ spaceData }) => {
                await dbStruct.appData.coll.eduIscedLevel.save({ _key: code, education: spaceData }, { silent: true, overwriteMode: 'conflict' })
              },
            },
          },
        }),
      },
      resourceTypes: {
        _: code => ({
          $: {
            create: {
              exe: async ({ spaceData }) => {
                await dbStruct.appData.coll.eduResourceType.save({ _key: code, education: spaceData }, { silent: true, overwriteMode: 'conflict' })
              },
            },
          },
        }),
      },
    },
  }
}
