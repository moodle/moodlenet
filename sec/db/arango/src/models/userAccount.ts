import { Error4xx } from '@moodle/domain/lib'
import { userAccount } from '@moodle/domain/model'
import { d_u__d, unreachable_never } from '@moodle/lib-types'
import { aql, AqlLiteral, AqlQuery, literal } from 'arangojs/aql'
import { userAccountSpaceFilter } from 'domain/src/domain/model/userAccount.model'
import { fromNullable } from 'fp-ts/Option'
import { dbStruct } from '../db-structure'

export function userAccountImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<userAccount.userAccountModel> {
  return {
    create: {
      exe: (/*ctx*/) =>
        async ({ record: userAccount }) => {
          await dbStruct.appData.coll.userSpace.save({
            _key: userAccount.userId,
            userAccount,
          })
        },
    },
    user: userId => {
      const impl: moo.model.impl<userAccount.userAccountModel['user'][string]> = {
        profile: {
          info: {
            put: {
              exe: (/*ctx*/) =>
                async ({ newData: info }) => {
                  const { old } = await dbStruct.appData.coll.userSpace.update({ _key: userId }, { userAccount: { profile: { info: info } } }, { returnOld: true })
                  return fromNullable(old && { was: old.userAccount.profile.info })
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
          const userSpaceDoc = literal(`userSpaceDoc`)
          const query = aql<userAccount.userAccountRecord>`
              FOR ${userSpaceDoc} IN ${dbStruct.appData.coll.userSpace}
                ${filters ? aql`FILTER ${getAqlUserAccountSpaceFilters({ varName: userSpaceDoc, filters })}` : ''}
                LIMIT ${limit}
                RETURN ${userSpaceDoc}.userAccount
            `
          // log.debug(query)
          const a_cursor = await dbStruct.appData.db.query(query)
          const items = await a_cursor.all()
          return { items }
        },
    },
  }
}

function getAqlUserAccountSpaceFilters({ varName, filters }: { varName: AqlLiteral; filters: userAccountSpaceFilter[] }): AqlQuery<boolean> {
  return filters.reduce(
    (acc, filter, index) => {
      const aqlFilter = filterProviders[filter.by](varName, filter)
      return aql`${acc}${literal(index === 0 ? ' ' : ` && `)}${aqlFilter}`
    },
    aql``,
  )
}
const filterProviders: { [filterName in userAccountSpaceFilter['by']]: (varName: AqlLiteral, filter: d_u__d<userAccountSpaceFilter, 'by', filterName>) => AqlQuery<boolean> } = {
  id: (varName, filter) =>
    filter.type === 'email'
      ? aql`${varName}.userAccount.email.address == ${filter.email}`
      : filter.type === 'userId'
        ? aql`${varName}._key == ${filter.userId}`
        : unreachable_never(filter, new Error4xx('Bad Request', 'Invalid filter type')),
}
