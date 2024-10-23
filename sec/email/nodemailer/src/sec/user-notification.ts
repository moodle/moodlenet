import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import {
  passwordChangedEmail,
  resetPasswordEmail,
  selfDeletionConfirmEmail,
  signupEmailConfirmationEmail,
} from '@moodle/lib-email-templates/user-account'
import { EmailLayoutContentProps, layoutEmail } from '@moodle/lib-email-templates/org'
import { _void, email_address, ok_ko } from '@moodle/lib-types'
import { OrgInfo } from '@moodle/module/org'
import { userNotification } from 'domain/src/modules/user-notification/types'
import { send } from '../lib'
import { NodemailerSecEnv } from '../types'

export function user_notification_service_factory(env: NodemailerSecEnv): secondaryProvider {
  return ctx => {
    const secondaryAdapter: secondaryAdapter = {
      userNotification: {
        service: {
          async enqueueNotificationToUser({ data }) {
            const deps = await layoutDeps()
            const [ok, content] = await getEmailLayoutProps({ data, orgInfo: deps.orgInfo })
            if (!ok) {
              return [false, content]
            }
            const [{ subject }, body] = layoutEmail({
              content: content.props,
              filestoreHttpHref: deps.filestoreHttp.href,
              orgInfo: deps.orgInfo,
              receiverEmail: content.receiverEmail,
            })
            await send({
              to: content.receiverEmail,
              body,
              subject,
              env,
              sender: env.sender,
            })
            return [true, _void]
          },
        },
      },
    }
    return secondaryAdapter

    async function layoutDeps() {
      const [
        { filestoreHttp },
        {
          configs: { info: orgInfo },
        },
      ] = await Promise.all([ctx.mod.env.query.deployments(), ctx.mod.env.query.modConfigs({ mod: 'org' })])
      return { filestoreHttp, orgInfo }
    }
    async function getEmailLayoutProps({
      data,
      orgInfo,
    }: {
      data: userNotification
      orgInfo: OrgInfo
    }): Promise<ok_ko<{ props: EmailLayoutContentProps; receiverEmail: email_address }, { userNotFound: unknown }>> {
      const { name: siteName } = orgInfo
      if (data.module === 'userAccount') {
        if (data.type === 'signupWithEmailConfirmation') {
          return [
            true,
            {
              receiverEmail: data.signupEmail,
              props: signupEmailConfirmationEmail({
                activateAccountUrl: data.activateAccountUrl,
                siteName,
                userName: data.userName,
              }),
            },
          ]
        }
        const [found, user] = await ctx.mod.userAccount.query.userBy({ userAccountId: data.toUserAccountId, by: 'id' })
        if (!found) {
          ctx.log('warn', `User not found for id ${data.toUserAccountId}`)
          return [false, { reason: 'userNotFound' }]
        }
        const receiverEmail = user.contacts.email
        // inactivityBeforeDeletion
        if (data.type === 'deleteAccountRequest') {
          return [
            true,
            { receiverEmail, props: selfDeletionConfirmEmail({ deleteAccountUrl: data.deleteAccountUrl, siteName }) },
          ]
        }
        if (data.type === 'passwordChanged') {
          return [true, { receiverEmail, props: passwordChangedEmail({ siteName }) }]
        }
        if (data.type === 'resetPasswordRequest') {
          return [true, { receiverEmail, props: resetPasswordEmail({ resetPasswordUrl: data.resetPasswordUrl, siteName }) }]
        }
      }
      throw new TypeError(`unknown data module|type ${data.module}|${data.type}`)
    }
  }
}
