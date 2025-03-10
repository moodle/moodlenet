import { userAccount } from '@moodle/domain/model'
import { aql, AqlLiteral, AqlQuery, literal } from 'arangojs/aql'
import { userAccountSpaceFilters } from 'domain/src/domain/model/userAccount.model'
import { fromNullable } from 'fp-ts/Option'
import { dbStruct } from '../db-structure'

export function userAccountImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<userAccount.userAccount> {
  return {
    user: {
      $: {
        one: {
          exe: async ({ filters } /* , _, { log } */) => {
            const userSpaceDoc = literal(`userSpaceDoc`)
            const query = aql<{ id: string; data: moo.model.ops.sSpaceData<userAccount.userAccountRecord> }>`
              FOR ${userSpaceDoc} IN ${dbStruct.appData.coll.userSpace}
                ${filters ? aql`FILTER ${getAqlUserAccountSpaceFilters({ varName: userSpaceDoc, filters })}` : ''}
                LIMIT 1
                RETURN {
                  id: ${userSpaceDoc}._key,
                  data: ${userSpaceDoc}.userAccount
                }
            `
            // log.debug(query)
            const cursor = await dbStruct.appData.db.query(query)
            const [m_userSpace] = await cursor.all()
            return fromNullable(m_userSpace)
          },
        },
      },
      _: userId => ({
        $: {
          create: {
            exe: async ({ spaceData: userAccount }) => {
              await dbStruct.appData.coll.userSpace.save({
                _key: userId,
                userAccount,
              })
            },
          },
          getData: {
            exe: async () => {
              const doc = await dbStruct.appData.coll.userSpace.document({ _key: userId }, { graceful: true })
              return fromNullable(doc?.userAccount)
            },
          },
        },
      }),
    },
  }
}

function getAqlUserAccountSpaceFilters({ varName, filters }: { varName: AqlLiteral; filters: userAccountSpaceFilters }): AqlQuery<boolean> {
  return [...Object.entries(filters), ...Object.entries(filters)].reduce(
    (acc, [filterName, value], index) => {
      const aqlFilter = filterProviders[filterName as keyof userAccountSpaceFilters](varName, value)
      return aql`${acc}${literal(index === 0 ? ' ' : ` && `)}${aqlFilter}`
    },
    aql``,
  )
}
const filterProviders: { [filterName in keyof userAccountSpaceFilters]: (varName: AqlLiteral, params: userAccountSpaceFilters[filterName]) => AqlQuery<boolean> } = {
  emailEquals: (varName, email) => aql`${varName}.userAccount.email.address == ${email}`,
}
