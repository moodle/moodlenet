import Argon from 'argon2'
import dot from 'dot'
import { MoodleNet } from '../..'
import { getAuthUserId, getJwtSigner } from '../../MoodleNetGraphQL'
import { User } from '../ContentGraph/ContentGraph.graphql.gen'
import { EmailObj } from '../Email/types'
import { ActiveUserAccount, EmailTemplate } from './persistence/types'
import { ArgonPwdHashOpts, getAccountPersistence } from './UserAccount.env'
import { SimpleResponse, UserSession } from './UserAccount.graphql.gen'

export const userSessionByActiveUserAccount = async ({
  activeUserAccount,
}: {
  activeUserAccount: ActiveUserAccount
}): Promise<UserSession> => {
  const { jwt } = await userAndJwtByActiveUserAccount({ activeUserAccount })
  const session: UserSession = {
    __typename: 'UserSession',
    jwt,
    accountId: activeUserAccount._id,
    changeEmailRequest: activeUserAccount.changeEmailRequest?.email ?? null,
    email: activeUserAccount.email,
    username: activeUserAccount.username,
  }
  return session
}

export const userAndJwtByActiveUserAccount = async ({
  activeUserAccount,
}: {
  activeUserAccount: ActiveUserAccount
}) => {
  const signJwt = getJwtSigner()
  const { node: maybeUser } = await MoodleNet.api(
    'ContentGraph.Node.ById'
  ).call((nodeById) =>
    nodeById<User>({
      _id: getAuthUserId({ accountUsername: activeUserAccount.username }),
    })
  )
  if (!maybeUser) {
    throw new Error(
      `can't find User for Account Username: ${activeUserAccount.username}`
    )
  }
  const jwt = await signJwt({
    account: activeUserAccount,
    user: maybeUser,
  })
  return { jwt, user: maybeUser }
}

export const getSimpleResponse = ({
  success,
  message,
}:
  | {
      success?: false
      message: string | null | undefined
    }
  | {
      success: true
      message?: null
    }): SimpleResponse => ({
  __typename: 'SimpleResponse',
  success: !!success,
  message: message || null,
})

export const hashPassword = (_: { pwd: string }) => {
  const { pwd } = _
  const hashedPassword = Argon.hash(pwd, ArgonPwdHashOpts)
  return hashedPassword
}

export const verifyPassword = (_: { hash: string; pwd: string | Buffer }) => {
  const { pwd, hash } = _
  return Argon.verify(hash, pwd, ArgonPwdHashOpts)
}

export const fillEmailTemplate = <Vars>(_: {
  template: EmailTemplate<Vars>
  to: string
  vars: Vars
  type?: 'text' | 'html'
}): EmailObj => {
  const { template, to, vars, type = 'html' } = _
  const tplString = template[type]
  const msg = { [type]: tplString && dot.compile(tplString)(vars) }
  return {
    ...template,
    ...msg,
    to,
  }
}

export async function getVerifiedAccountByUsernameAndPassword({
  password,
  username,
}: {
  username: string
  password: string
}) {
  const accountPersistence = await getAccountPersistence()
  const account = await accountPersistence.getActiveAccountByUsername({
    username,
  })

  if (!account) {
    return null
  }

  const pwdVerified = await verifyPassword({
    hash: account.password,
    pwd: password,
  })
  return pwdVerified ? account : null
}
