import { Error4xx } from '@moodle/domain/lib'
import { userHome } from '@moodle/domain/model'
import { d_u__d, unreachable_never } from '@moodle/lib-types'
import { aql, AqlLiteral, AqlQuery, literal } from 'arangojs/aql'
import { userHomeSpaceFilter } from 'domain/src/domain/model/userHome.model'
import { fromNullable } from 'fp-ts/Option'
import { dbStruct } from '../db-structure'

export function userHomeImpl({ dbStruct }: { dbStruct: dbStruct }): moo.def.model.impl<userHome.userHome> {
  return {
    create: {
      exe: (/*ctx*/) =>
        async ({ userHomeRecord /* , id  */ }) => {
          await dbStruct.appData.coll.userHome.save({
            _key: userHomeRecord.userId,
            userHome: userHomeRecord,
          })
        },
    },
    user: userId => {
      const impl: moo.def.model.impl<userHome.userHome['user'][string]> = {
        profile: {
          info: {
            put: {
              exe: (/*ctx*/) =>
                async ({ newData: info }) => {
                  const { old } = await dbStruct.appData.coll.userHome.update({ _key: userId }, { userHome: { profile: { info: info } } }, { returnOld: true })
                  return fromNullable(old && { was: old.userHome.profile.info })
                },
            },
          },
        },
      }
      return impl
    },

    find: {
      exe: (/*ctx*/) =>
        async ({ filters, limit = 1 }) => {
          const userHomeDoc = literal(`userHomeDoc`)
          const query = aql<userHome.userHomeRecord>`
              FOR ${userHomeDoc} IN ${dbStruct.appData.coll.userHome}
                ${filters ? aql`FILTER ${getAqlUserHomeSpaceFilters({ varName: userHomeDoc, filters })}` : ''}
                LIMIT ${limit}
                RETURN ${userHomeDoc}.userHome
            `
          // log.debug(query)
          const a_cursor = await dbStruct.appData.db.query(query)
          const items = await a_cursor.all()
          return { items }
        },
    },
  }
}

function getAqlUserHomeSpaceFilters({ varName, filters }: { varName: AqlLiteral; filters: userHomeSpaceFilter[] }): AqlQuery<boolean> {
  return filters.reduce(
    (acc, filter, index) => {
      const aqlFilter = filterProviders[filter.by](varName, filter)
      return aql`${acc}${literal(index === 0 ? ' ' : ` && `)}${aqlFilter}`
    },
    aql``,
  )
}
const filterProviders: { [filterName in userHomeSpaceFilter['by']]: (varName: AqlLiteral, filter: d_u__d<userHomeSpaceFilter, 'by', filterName>) => AqlQuery<boolean> } = {
  id: (varName, filter) =>
    filter.type === 'email'
      ? aql`${varName}.userHome.email.address == ${filter.email}`
      : filter.type === 'userId'
        ? aql`${varName}._key == ${filter.userId}`
        : unreachable_never(filter, new Error4xx('Bad Request', 'Invalid filter type')),
}
