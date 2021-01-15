import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { LookupEventType } from '../../../../lib/domain/event/types'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { UserVertex } from '../persistence/glyph'

export type CreateUserPersistence = (_: {
  username: string
}) => Promise<UserVertex>

export type User_Create_For_New_Account_Api = Api<
  LookupEventType<
    MoodleNetDomain,
    'UserAccount.Register_New_Account.New_Account_Activated'
  >,
  { newUser: UserVertex | null }
>

export const User_Create_For_New_Account_Api_Handler = async () => {
  const { createUser } = await getContentGraphPersistence()

  const handler: RespondApiHandler<User_Create_For_New_Account_Api> = async ({
    req: { username },
  }) => {
    const user = await createUser({ username })
    return { newUser: user }
  }

  return handler
}
