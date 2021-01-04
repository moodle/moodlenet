import Argon from 'argon2'
import dot from 'dot'
import JWT, { SignOptions } from 'jsonwebtoken'
import { EmailObj } from '../Email/types'
import { MoodleNetExecutionAuth } from '../GraphQLGateway/JWT'
import { ActiveUserAccount, EmailTemplate } from './persistence/types'
import {
  ArgonPwdHashOpts,
  getAccountPersistence,
  jwtSignBaseOpts,
  JWT_PRIVATE_KEY,
} from './UserAccount.env'
import { SessionAccount } from './UserAccount.graphql.gen'

export const hashPassword = (_: { pwd: string }) => {
  const { pwd } = _
  const hashedPassword = Argon.hash(pwd, ArgonPwdHashOpts)
  return hashedPassword
}

export const verifyPassword = (_: { hash: string; pwd: string | Buffer }) => {
  const { pwd, hash } = _
  return Argon.verify(hash, pwd, ArgonPwdHashOpts)
}

export const signJwt = async (_: {
  account: ActiveUserAccount
  opts?: SignOptions
}) => {
  const {
    account: { email, _id, username, changeEmailRequest },
    opts,
  } = _
  const sessionAccount: SessionAccount = {
    __typename: 'SessionAccount',
    accountId: _id,
    changeEmailRequest: changeEmailRequest?.email ?? null,
    email,
    username,
  }
  const moodleNetExecutionAuth: MoodleNetExecutionAuth = {
    sessionAccount,
  }

  const persistence = await getAccountPersistence()

  const cfg = await persistence.getConfig()

  return JWT.sign(moodleNetExecutionAuth, JWT_PRIVATE_KEY, {
    expiresIn: cfg.sessionValiditySecs,
    ...jwtSignBaseOpts,
    ...opts,
  })
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

export async function getVerifiedAccountByUsername({
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
    return false
  }

  const pwdVerified = await verifyPassword({
    hash: account.password,
    pwd: password,
  })
  return pwdVerified && account
}
