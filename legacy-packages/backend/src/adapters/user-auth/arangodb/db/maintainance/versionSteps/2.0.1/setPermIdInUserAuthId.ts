import { Database } from 'arangojs'
import { aqlstr, getOneResult } from '../../../../../../../lib/helpers/arango/query'
import { USER } from '../../../../types'

export const setPermIdInUserAuthId = async ({ db }: { db: Database }) => {
  const contentDB = db.database('ContentGraph')
  const q = `FOR u in ${USER} RETURN u`
  const userCursor = await db.query(q, {}, { batchSize: 200 })
  let batchCount = 0
  for await (const batch of userCursor.batches) {
    const from = ++batchCount * batch.length
    const to = from + batch.length
    console.log(`updating ${from}-${to} users batch ...`)
    await Promise.all(
      batch.map(async user => {
        const {
          authId: { _type, _authKey },
          email,
          _id,
        } = user

        const creatorPermIdQ = `
        FOR v in ${_type}
        FILTER v._authKey == ${aqlstr(_authKey)}
        LIMIT 1
        RETURN v._key
        `

        const creatorPermId = await getOneResult(creatorPermIdQ, contentDB)
        if (!creatorPermId) {
          throw new Error(`Couldn't find creator of ${email}`)
        }
        const updateQ = `
          UPDATE DOCUMENT(${aqlstr(_id)}) WITH { authId: { _permId: ${aqlstr(creatorPermId)} } } IN ${USER}
          RETURN null
        `
        await db.query(updateQ)
      }),
    )
  }
}
