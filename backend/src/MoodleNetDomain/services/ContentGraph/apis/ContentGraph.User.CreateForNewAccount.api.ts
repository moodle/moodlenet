import { LookupEventType } from '../../../../lib/domain/event/types'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { Role, User } from '../ContentGraph.graphql.gen'
import { ShallowNode, SystemUserId } from '../persistence/types'

export type CreateUserPersistence = (_: {
  username: string
  role: Role
  creatorId: string
}) => Promise<ShallowNode<User>>

type NewAccountActivated /* Pick< */ = LookupEventType<
  MoodleNetDomain,
  'UserAccount.RegisterNewAccount.NewAccountActivated'
> /* ,
  'username'
> */

export const UserCreateForNewAccountApiHandler = async ({
  username,
}: NewAccountActivated): Promise<ShallowNode<User> | null> => {
  const { createUser } = await getContentGraphPersistence()
  const newUser = await createUser({
    username,
    role: Role.User,
    creatorId: SystemUserId,
  })
  return newUser
}
