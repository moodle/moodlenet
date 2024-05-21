import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { unsetTokenContext } from '@moodlenet/web-user/server'
import { shell } from '../shell.mjs'
import {
  delFlowStatus,
  doSendFirstContributionEmail,
  doSendLastContributionEmail,
  doSendWelcomeEmail,
  readApprovalFlowStatus,
  setFlowStatus,
  setProfileAsPublisher,
} from '../srv.mjs'

export async function deletedProfile({ profileKey }: { profileKey: string }) {
  await delFlowStatus({
    profileKey,
  })
}

export async function manageProfile({ profileKey }: { profileKey: string }) {
  return shell.initiateCall(async () => {
    await unsetTokenContext()
    await setPkgCurrentUser()
    const flowStatus = await readApprovalFlowStatus({ profileKey })
    // console.log('manageProfile', profileKey, flowStatus)
    if (flowStatus.type !== 'ongoing') {
      return
    }
    flowStatus.type === 'ongoing'
    const { amountForAutoApproval, currentCreatedResourceLeastAmount, sentEmails, user } =
      flowStatus
    const yetTocreate = amountForAutoApproval - currentCreatedResourceLeastAmount
    // console.log({ yetTocreate, sentEmails, currentCreatedResourceLeastAmount })
    if (yetTocreate === 0) {
      await setProfileAsPublisher({ profileKey })
      await setFlowStatus({
        profileKey,
        flowStatus: { type: 'ended', sentEmails },
      })
    } else if (yetTocreate === 1 && !sentEmails.last) {
      await doSendLastContributionEmail({
        user,
        currentCreatedResourceLeastAmount,
      })

      await setFlowStatus({
        profileKey,
        flowStatus: {
          type: 'ongoing',
          sentEmails: { ...sentEmails, last: true },
        },
      })
    } else if (currentCreatedResourceLeastAmount === 1 && !sentEmails.first) {
      await doSendFirstContributionEmail({ user, yetTocreate })
      await setFlowStatus({
        profileKey,
        flowStatus: { type: 'ongoing', sentEmails: { ...sentEmails, first: true } },
      })
    } else if (currentCreatedResourceLeastAmount === 0 && !sentEmails.welcome) {
      await doSendWelcomeEmail({ user })
      await setFlowStatus({
        profileKey,
        flowStatus: { type: 'ongoing', sentEmails: { ...sentEmails, welcome: true } },
      })
    }
  })
}
