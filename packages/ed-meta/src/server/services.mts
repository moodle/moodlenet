import { currentEntityVar, queryEntities } from '@moodlenet/system-entities/server'
import { EdAssetType, IscedField, IscedGrade, Language, License } from './init/sys-entities.mjs'

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
