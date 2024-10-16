import { secondaryAdapter, secondaryBootstrap } from '@moodle/domain'
import { send } from '../../lib'
import { NodemailerSecEnv } from '../../types'
import { user_id } from '@moodle/module/iam'
import {
  passwordChangedEmail,
  resetPasswordEmail,
  selfDeletionConfirmEmail,
  signupEmailConfirmationEmail,
} from '@moodle/lib-email-templates/iam'
import { layoutEmail } from '@moodle/lib-email-templates/org'

export function iam_secondary_factory(env: NodemailerSecEnv): secondaryBootstrap {
  return ({ log }) => {
    return secondaryCtx => {
      const secondaryAdapter: secondaryAdapter = {
        iam: {
          queue: {
            async notifyUserOnAccountSelfDeletionRequest({ deleteAccountUrl, toUserId }) {
              const deps = await userLayoutDeps({ toUserId })
              if (!deps) return

              const [{ subject }, body] = layoutEmail({
                ...deps,
                content: selfDeletionConfirmEmail({ deleteAccountUrl, siteName: deps.orgInfo.name }),
              })

              send({
                to: deps.user.contacts.email,
                body,
                subject,
                env,
                sender: env.sender,
              })
            },

            async notifyUserOnPasswordChanged({ toUserId }) {
              const deps = await userLayoutDeps({ toUserId })
              if (!deps) return

              const [{ subject }, body] = layoutEmail({
                ...deps,
                content: passwordChangedEmail({ siteName: deps.orgInfo.name }),
              })

              send({
                to: deps.user.contacts.email,
                body,
                subject,
                env,
                sender: env.sender,
              })
            },

            async notifyUserOnResetPasswordRequest({ resetPasswordUrl, toUserId }) {
              const deps = await userLayoutDeps({ toUserId })
              if (!deps) return

              const [{ subject }, body] = layoutEmail({
                ...deps,
                content: resetPasswordEmail({ resetPasswordUrl, siteName: deps.orgInfo.name }),
              })

              send({
                to: deps.user.contacts.email,
                body,
                subject,
                env,
                sender: env.sender,
              })
            },

            async notifyUserOnSignupWithEmailConfirmation({ activateAccountUrl, signupEmail, userName }) {
              const deps = await layoutDeps()
              if (!deps) return

              const [{ subject }, body] = layoutEmail({
                ...deps,
                receiverEmail: signupEmail,
                content: signupEmailConfirmationEmail({ activateAccountUrl, userName, siteName: deps.orgInfo.name }),
              })

              send({
                to: signupEmail,
                body,
                subject,
                env,
                sender: env.sender,
              })
            },
          },
        },
      }
      return secondaryAdapter
      async function userLayoutDeps({ toUserId }: { toUserId: user_id }) {
        const [[found, user], { filestoreHttpHref, orgInfo }] = await Promise.all([
          secondaryCtx.mod.iam.query.userBy({ userId: toUserId, by: 'id' }),
          layoutDeps(),
        ])
        if (!found) {
          log('alert', `User not found for id ${toUserId}`)
          return
        }
        return { user, receiverEmail: user.contacts.email, filestoreHttpHref, orgInfo }
      }
      async function layoutDeps() {
        const [
          { filestoreHttp },
          {
            configs: { info: orgInfo },
          },
        ] = await Promise.all([
          secondaryCtx.mod.env.query.deployments(),
          secondaryCtx.mod.env.query.modConfigs({ mod: 'org' }),
        ])
        return { filestoreHttpHref: filestoreHttp.href, orgInfo }
      }
    }
  }
}
