import { statics } from '@moodle/domain/model'
import { deep_partial_props } from '@moodle/lib-types'
import { dbStruct, staticData } from '../db-structure'
const LATEST_KEY = 'latest'
export function staticsImpl({ dbStruct }: { dbStruct: dbStruct }): moo.def.model.impl<statics.staticsModel> {
  return {
    data: {
      type: {
        put: {
          exe: (/* ctx */) =>
            async ({ data, ns, kind, type }) => {
              await allMerge({ [kind]: { [ns]: { [type]: data } } })
            },
        },
        get: {
          exe: (/* ctx */) =>
            async ({ kind, ns, type }) => {
              return { data: (await getAll()).all[kind][ns][type] }
            },
        },
      },
      ns: {
        put: {
          exe: (/* ctx */) =>
            async ({ data, ns, kind }) => {
              await allMerge({ [kind]: { [ns]: data } })
            },
        },
        get: {
          exe: (/* ctx */) =>
            async ({ kind, ns }) => {
              return { data: (await getAll()).all[kind][ns] }
            },
        },
      },
      kind: {
        put: {
          exe: (/* ctx */) =>
            async ({ data, kind }) => {
              await allMerge({ [kind]: data })
            },
        },
        get: {
          exe: (/* ctx */) =>
            async ({ kind }) => {
              return { data: (await getAll()).all[kind] }
            },
        },
      },
    },

    latestModelUpgrade: {
      get: {
        exe: (/* ctx */) => async () => {
          const doc = await dbStruct.services.coll.modelUpgrade.document({ _key: LATEST_KEY }, { graceful: true })
          if (!doc) return null
          return doc.data
        },
      },
      save: {
        exe: (/* ctx */) => async modelUpgradeData => {
          await dbStruct.services.coll.modelUpgrade.saveAll(
            [
              { _key: `${modelUpgradeData.previous}::${modelUpgradeData.current}`, data: modelUpgradeData },
              { _key: LATEST_KEY, data: modelUpgradeData },
            ],
            { overwriteMode: 'replace', silent: true },
          )
        },
      },
    },
  }
  async function getAll(_key = LATEST_KEY) {
    return dbStruct.appData.coll.staticData.document({ _key })
  }
  async function allMerge(data: deep_partial_props<staticData['all']>, _key = LATEST_KEY) {
    await dbStruct.appData.coll.staticData.save({ _key, all: data as staticData['all'] }, { mergeObjects: true, overwriteMode: 'update' })
  }
}
