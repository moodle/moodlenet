import { MoodleNet } from '../../../..'
import { userAccountRoutes } from '../../UserAccount.routes'
import { MutationResolvers } from '../../UserAccount.graphql.gen'

export const activateAccount: MutationResolvers['activateAccount'] = async (
  _parent,
  { password, username, token }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'UserAccount.Register_New_Account.Confirm_Email_Activate_Account',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { password, token, username },
  })
  if (res.___ERROR) {
    return {
      __typename: 'Session',
      message: res.___ERROR.msg,
      auth: null,
    }
  } else if (!res.auth) {
    return {
      __typename: 'Session',
      auth: null,
      message: 'not found',
    }
  } else {
    const {
      jwt,
      userAccount: { changeEmailRequest, username, email, _id },
    } = res.auth
    return {
      __typename: 'Session',
      auth: {
        __typename: 'Auth',
        jwt,
        sessionAccount: {
          __typename: 'SessionAccount',
          accountId: _id,
          changeEmailRequest: changeEmailRequest?.email || null,
          email,
          username,
        },
      },
      message: null,
    }
  }
}
