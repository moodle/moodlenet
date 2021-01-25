import { User } from '../../../../ContentGraph.graphql.gen'
import { ContentGraphPersistence, ShallowNode } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { createMeta } from '../ContentGraph.persistence.arango.helpers'

export const createUser: ContentGraphPersistence['createUser'] = async ({
  username,
  role,
  creatorId,
}) => {
  const { db } = await DBReady
  const newUser: Omit<ShallowNode<User>, '_id' | '_meta'> = {
    __typename: 'User',
    role,
    displayName: username,
  }

  const cursor = await db.query(`
      INSERT MERGE(
        ${newUser},
        {
          _key: ${username},
          _meta: ${createMeta({ userId: creatorId })}
        }
      ) INTO User
      RETURN NEW
    `)

  const user: ShallowNode<User> = await cursor.next()
  cursor.kill()
  return user
}
