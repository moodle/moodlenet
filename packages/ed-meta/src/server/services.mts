import {
  currentEntityVar,
  getEntity,
  queryEntities,
  sysEntitiesDB,
} from '@moodlenet/system-entities/server'
import { EdAssetType, IscedField, IscedGrade, Language, License } from './init/sys-entities.mjs'
import type { IscedFieldDataType } from './types.mjs'

export async function getAllPublishedMeta() {
  const preAccessBody = `FILTER ${currentEntityVar}.published`
  const limit = 200
  const [licenses, edAssetTypes, languages, iscedGrades, iscedFields] = await Promise.all([
    (await queryEntities(License.entityClass, { preAccessBody, limit })).all(),
    (await queryEntities(EdAssetType.entityClass, { preAccessBody, limit })).all(),
    (await queryEntities(Language.entityClass, { preAccessBody, limit })).all(),
    (await queryEntities(IscedGrade.entityClass, { preAccessBody, limit })).all(),
    (await queryEntities(IscedField.entityClass, { preAccessBody, limit })).all(),
  ])
  return { licenses, edAssetTypes, languages, iscedGrades, iscedFields }
}

export async function getIscedFieldRecord(_key: string) {
  const foundIscedField = await getEntity(IscedField.entityClass, _key)
  return foundIscedField
}

export async function deltaIscedFieldPopularityItem({
  _key,
  itemName,
  delta,
}: {
  _key: string
  itemName: string
  delta: number
}) {
  const updatePopularityResult = await sysEntitiesDB.query<IscedFieldDataType>({
    query: `FOR res in @@iscedFieldCollection
      FILTER res._key == @_key
      LIMIT 1
      UPDATE res WITH {
        popularity:{
          overall: res.popularity.overall + ( ${delta} ),
          items:{
            "${itemName}": (res.popularity.items["${itemName}"] || 0) + ( ${delta} )
          }
        }
      } IN @@iscedFieldCollection
      RETURN NEW`,
    bindVars: { '@iscedFieldCollection': IscedField.collection.name, _key },
  })
  const updated = await updatePopularityResult.next()
  return updated?.popularity?.overall
}
