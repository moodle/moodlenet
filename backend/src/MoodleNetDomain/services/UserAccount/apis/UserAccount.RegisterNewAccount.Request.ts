import { v4 as uuidV4 } from 'uuid'
import { MoodleNet } from '../../..'
import { Flow } from '../../../../lib/domain/types/path'
import { Messages } from '../persistence/types'
import { getAccountPersistence } from '../UserAccount.env'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import { fillEmailTemplate } from '../UserAccount.helpers'
import { userAccountRoutes } from '../UserAccount.routes'

export type NewAccountRequestPersistence = (_: {
  email: string
  token: string
  flow: Flow
}) => Promise<null | Messages.EmailNotAvailable>

export type RegisterNewAccountRequestReq = { email: string; flow: Flow }
export type RegisterNewAccountRequestRes =
  | { success: true }
  | { success: false; reason: string }

export const RegisterNewAccountRequestApiHandler = async ({
  email,
  flow,
}: RegisterNewAccountRequestReq): Promise<RegisterNewAccountRequestRes> => {
  const { getConfig, newAccountRequest } = await getAccountPersistence()
  const config = await getConfig()
  const { newAccountRequestEmail, newAccountVerificationWaitSecs } = config
  const token = uuidV4()

  const resp = await newAccountRequest({
    email,
    flow,
    token,
  })
  if (typeof resp === 'string') {
    return { success: false, reason: resp } as const
  } else {
    const emailObj = fillEmailTemplate({
      template: newAccountRequestEmail,
      to: email,
      vars: {
        email,
        link: `https://xxx.xxx/new-account-confirm/${token}`,
      },
    })
    await Promise.all([
      MoodleNet.api('Email.SendOne.SendNow').enqueue(
        (sendOne, flow) => sendOne({ emailObj, flow }),
        userAccountRoutes.setRoute(flow, 'Register-New-Account')
      ),
      MoodleNet.api('UserAccount.RegisterNewAccount.DeleteRequest').enqueue(
        (deleteRequest) => deleteRequest({ token }),
        flow,
        {
          delaySecs: newAccountVerificationWaitSecs,
        }
      ),
    ])
    return { success: true } as const
  }
}

export const signUp: MutationResolvers['signUp'] = async (
  _parent,
  { email },
  context
) => {
  const res = await MoodleNet.api(
    'UserAccount.RegisterNewAccount.Request'
  ).call(
    (registerNewAccountReq, flow) => registerNewAccountReq({ email, flow }),
    context.flow
  )

  if (!res.success) {
    return {
      __typename: 'SimpleResponse',
      message: res.reason,
      success: false,
    }
  } else {
    return {
      __typename: 'SimpleResponse',
      message: null,
      success: true,
    }
  }
}
