import Argon from 'argon2'
import dot from 'dot'
import { EmailObj } from '../Email/types'
import { EmailTemplate } from './persistence/types'
import { ArgonPwdHashOpts, getAccountPersistence } from './UserAccount.env'
import {
  getAuthUserId,
  getJwtSigner,
  graphQLRequestApiCaller,
} from '../../MoodleNetGraphQL'
import { ActiveUserAccount } from './persistence/types'
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
  const { res } = await graphQLRequestApiCaller({
    api: 'ContentGraph.User.ById',
    req: {
      userId: getAuthUserId({ accountUsername: activeUserAccount.username }),
    },
  })
  if (res.___ERROR) {
    throw new Error(res.___ERROR.msg)
  } else if (!res.user) {
    throw new Error(
      `can't find User for Account Username: ${activeUserAccount.username}`
    )
  }
  const jwt = await signJwt({
    account: activeUserAccount,
    user: res.user,
  })
  return { jwt, user: res.user }
}

export const getSimpleResponse = ({
  success,
  message,
}:
  | {
      success?: false
      message: string | null
    }
  | {
      success: true
      message?: null
    }): SimpleResponse => ({
  __typename: 'SimpleResponse',
  success: !!success,
  message: message ?? null,
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
