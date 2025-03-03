import { education } from '@moodle/domain/model'
import { dbStruct } from '../db-structure'

export function educationImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<education.educationModel> {
  return {
    categories: {
      bloomCognitives: {
        $: {
          createMany: {
            exe: async ({ spaces }) => {
              await dbStruct.appData.coll.eduBloomCognitive.saveAll(
                spaces.map(({ id, data }) => ({ _key: id, education: data })),
                { silent: true, overwriteMode: 'replace' },
              )
            },
          },
        },
      },
      iscedFields: {
        $: {
          createMany: {
            exe: async ({ spaces }) => {
              await dbStruct.appData.coll.eduIscedField.saveAll(
                spaces.map(({ id, data }) => ({ _key: id, education: data })),
                { silent: true, overwriteMode: 'replace' },
              )
            },
          },
        },
      },
      iscedLevels: {
        $: {
          createMany: {
            exe: async ({ spaces }) => {
              await dbStruct.appData.coll.eduIscedLevel.saveAll(
                spaces.map(({ id, data }) => ({ _key: id, education: data })),
                { silent: true, overwriteMode: 'replace' },
              )
            },
          },
        },
      },
      resourceTypes: {
        $: {
          createMany: {
            exe: async ({ spaces }) => {
              await dbStruct.appData.coll.eduResourceType.saveAll(
                spaces.map(({ id, data }) => ({ _key: id, education: data })),
                { silent: true, overwriteMode: 'replace' },
              )
            },
          },
        },
      },
    },
  }
}
