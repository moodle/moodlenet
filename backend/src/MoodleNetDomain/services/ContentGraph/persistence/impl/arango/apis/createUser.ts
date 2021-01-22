import { User } from '../../../../ContentGraph.graphql.gen'
import {
  ContentGraphPersistence,
  ROOTUserId,
  ShallowNode,
} from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { createMeta } from './helpers'

export const createUser: ContentGraphPersistence['createUser'] = async ({
  username,
  role,
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
          ${createMeta({ creatorUserId: ROOTUserId })}
        }
      ) INTO User
      RETURN NEW
    `)

  const user: ShallowNode<User> = await cursor.next()
  cursor.kill()
  return user
}
