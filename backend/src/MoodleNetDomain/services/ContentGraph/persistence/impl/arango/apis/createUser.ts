import { aql } from 'arangojs'
import { UserVertex } from '../../../glyph'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const createUser = DBReady.then(
  ({ db }): ContentGraphPersistence['createUser'] => async ({ username }) => {
    const newUser: Omit<UserVertex, '_id'> = {
      __typename: 'User',
      displayName: username,
    }

    const cursor = await db.query(aql`
      INSERT MERGE(
        ${newUser},
        {
          _key: ${username},
        }
      ) INTO User
      RETURN NEW
    `)

    const user: UserVertex = await cursor.next()

    return user
  }
)
