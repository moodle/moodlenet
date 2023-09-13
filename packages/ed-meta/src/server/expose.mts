import type { EdMetaExposeType } from '../common/expose-def.mjs'
import { getAllPublishedMeta, getIscedFieldRecord, searchIscedFields } from './services.mjs'
import { shell } from './shell.mjs'

// import { ResourceDataResponce, ResourceFormValues } from '../common.mjs'

export const expose = await shell.expose<EdMetaExposeType>({
  rpc: {
    'webapp/subject-page-data/:_key': {
      guard: () => void 0,
      async fn(_, { _key }) {
        const iscedField = await getIscedFieldRecord(_key)
        if (!iscedField) {
          return null
        }
        return {
          iscedUrl:
            'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=International_Standard_Classification_of_Education_(ISCED)',
          isIsced: true,
          title: iscedField.entity.name,
        }
      },
    },
    'webapp/get-all-published-meta': {
      guard: () => void 0,
      async fn() {
        const pubMetas = await getAllPublishedMeta()
        // shell.log('debug', { pubMetas })
        return {
          learningOutcomes: pubMetas.bloomCognitives.map(({ entity: { _key, name, verbs } }) => ({
            name,
            code: _key,
            verbs,
          })),
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
    'webapp/search': {
      guard: () => void 0,
      async fn(_, __, { limit, sortType, text, after }) {
        const { endCursor, list } = await searchIscedFields({ limit, sortType, text, after })
        return {
          list: list.map(({ entity: { _key } }) => ({ _key })),
          endCursor,
        }
      },
    },
  },
})
