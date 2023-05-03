import { EntityInfo, ENTITY_INFO_PROVIDERS } from '../entity-info.mjs'
import { includesSameClass } from '../lib.mjs'
import { AqlVal, EntityClass, SomeEntityDataType } from '../types.mjs'
import { currentEntityVar, entityIdentifier2EntityIdAql, toaql } from './aql.mjs'

export function userInfoAqlProvider(
  systemUserVar: string,
  opts?: { restrictToEntityClasses?: EntityClass<SomeEntityDataType>[] },
): AqlVal<EntityInfo> {
  const providersRows = ENTITY_INFO_PROVIDERS.filter(({ providerItem: { entityClass } }) =>
    !opts?.restrictToEntityClasses
      ? true
      : includesSameClass(entityClass, opts?.restrictToEntityClasses),
  ).map(({ providerItem: { aqlProvider, entityClass } }) => {
    const isSameClass = `${toaql(entityClass)} == ${systemUserVar}.entityIdentifier.entityClass`
    const resolvedInfo = aqlProvider('creatorDoc')
    return `( ${isSameClass} ? ( ${resolvedInfo} ) : null )`
  })
  const providersArrayAql = `[ ${providersRows.join(' , ')} ]`
  const entityProvidersAql = `(( 
    LET creatorDoc = DOCUMENT(${entityIdentifier2EntityIdAql(`${systemUserVar}.entityIdentifier`)})
    FOR entityInfo in ${providersArrayAql} FILTER !!entityInfo LIMIT 1 RETURN entityInfo )[0])`
  const aql = `(
    ${systemUserVar}.type == 'entity' ? ${entityProvidersAql} 
    : ${systemUserVar}.type == 'root' ? { iconUrl: '', name: 'ROOT', homepagePath: '' }
    : /* type == 'pkg' */ { iconUrl: '', name: ${systemUserVar}.pkgName, homepagePath: '' }
  )`
  return aql
}

export function creatorUserInfoAqlProvider(): AqlVal<EntityInfo> {
  return userInfoAqlProvider(`${currentEntityVar}._meta.creator`)
}
