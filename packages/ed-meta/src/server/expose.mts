import type { EdMetaExposeType } from '../common/expose-def.mjs'
import { getAllPublishedMeta } from './services.mjs'
import { shell } from './shell.mjs'

// import { ResourceDataResponce, ResourceFormValues } from '../common.mjs'

export const expose = await shell.expose<EdMetaExposeType>({
  rpc: {
    'webapp/get-all-published-meta': {
      guard: async () => true,
      async fn() {
        const pubMetas = await getAllPublishedMeta()
        // console.log({ pubMetas })
        return {
          languages: pubMetas.languages.map(({ entity: { _key, name } }) => ({
            label: name,
            value: _key,
          })),
          licenses: pubMetas.licenses.map(({ entity: { _key, description } }) => ({
            label: description,
            value: _key,
          })),
          levels: pubMetas.iscedGrades.map(({ entity: { _key, name } }) => ({
            label: name,
            value: _key,
          })),
          subjects: pubMetas.iscedFields.map(({ entity: { _key, name } }) => ({
            label: name,
            value: _key,
          })),
          types: pubMetas.edAssetTypes.map(({ entity: { _key, description } }) => ({
            label: description,
            value: _key,
          })),
        }
      },
    },
  },
})
