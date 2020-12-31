import { MoodleNet } from '../../../../..'
import { userAccountRoutes } from '../../../UserAccount.routes'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'

export const confirmSignUpEmail: MutationResolvers['confirmSignUpEmail'] = async (
  _parent,
  { token }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Email.Verify_Email.Confirm_Email',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { token },
  })
  return res.___ERROR
    ? null
    : !res.success
    ? null
    : {
        __typename: 'RequestConfirmEmailResponse',
        ...{ flowKey: res.flow._key },
      }
}
