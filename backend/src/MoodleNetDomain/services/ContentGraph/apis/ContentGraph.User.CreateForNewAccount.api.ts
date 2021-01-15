import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { LookupEventType } from '../../../../lib/domain/event/types'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { UserVertex } from '../persistence/glyph'

export type CreateUserPersistence = (_: {
  username: string
}) => Promise<UserVertex>

export type UserCreateForNewAccountApi = Api<
  LookupEventType<
    MoodleNetDomain,
    'UserAccount.RegisterNewAccount.NewAccountActivated'
  >,
  { newUser: UserVertex | null }
>

export const UserCreateForNewAccountApiHandler = async () => {
  const { createUser } = await getContentGraphPersistence()

  const handler: RespondApiHandler<UserCreateForNewAccountApi> = async ({
    req: { username },
  }) => {
    const user = await createUser({ username })
    return { newUser: user }
  }

  return handler
}
