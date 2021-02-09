import { webappPath, Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { v4 as uuidV4 } from 'uuid'
import { api } from '../../../../lib/domain'
import { Flow } from '../../../../lib/domain/types/path'
import { getMNEnv } from '../../../MoodleNet.env'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
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
export type RegisterNewAccountRequestRes = { success: true } | { success: false; reason: string }

export const RegisterNewAccountRequestApiHandler = async ({
  email,
  flow,
}: RegisterNewAccountRequestReq): Promise<RegisterNewAccountRequestRes> => {
  const { publicBaseUrl } = getMNEnv()

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
    return { success: false, reason: resp }
  } else {
    const emailObj = fillEmailTemplate({
      template: newAccountRequestEmail,
      to: email,
      vars: {
        email,
        link: `${publicBaseUrl}${webappPath<Routes.ActivateNewAccount>('/activate-new-account/:token', {
          token,
        })}`,
      },
    })
    await Promise.all([
      api<MoodleNetDomain>(userAccountRoutes.setRoute(flow, 'Register-New-Account'))(
        'Email.SendOne.SendNow',
      ).enqueue((sendOne, flow) => sendOne({ emailObj, flow })),
      api<MoodleNetDomain>(flow)('UserAccount.RegisterNewAccount.DeleteRequest').enqueue(
        deleteRequest => deleteRequest({ token }),
        {
          delaySecs: newAccountVerificationWaitSecs,
        },
      ),
    ])
    return { success: true }
  }
}

export const signUp: MutationResolvers['signUp'] = async (_parent, { email }, context) => {
  const res = await api<MoodleNetDomain>(context.flow)(
    'UserAccount.RegisterNewAccount.Request',
  ).call((registerNewAccountReq, flow) => registerNewAccountReq({ email, flow }))

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
