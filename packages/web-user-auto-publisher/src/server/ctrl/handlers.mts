import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
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
export async function welcomeNewWebUser({ profileKey }: { profileKey: string }) {
  return shell.initiateCall(async () => {
    await setPkgCurrentUser()

    const flowStatus = await readApprovalFlowStatus({ profileKey })
    if (!(flowStatus.type === 'ongoing' && !flowStatus.sentEmails.welcome)) {
      return
    }
    const { user } = flowStatus
    await doSendWelcomeEmail({
      user,
    })
  })
}
export async function profileCreatedResource({ profileKey }: { profileKey: string }) {
  return shell.initiateCall(async () => {
    const flowStatus = await readApprovalFlowStatus({ profileKey })
    if (flowStatus.type !== 'ongoing') {
      return
    }
    flowStatus.type === 'ongoing'
    await setPkgCurrentUser()
    const { amountForAutoApproval, currentCreatedResourceLeastAmount, sentEmails, user } =
      flowStatus
    const yetTocreate = amountForAutoApproval - currentCreatedResourceLeastAmount
    if (yetTocreate === 0) {
      await setProfileAsPublisher({ profileKey })
      await setFlowStatus({
        profileKey,
        flowStatus: { type: 'ended', sentEmails: flowStatus.sentEmails },
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
          sentEmails: { ...flowStatus.sentEmails, last: true },
        },
      })
    } else if (currentCreatedResourceLeastAmount === 1 && !sentEmails.first) {
      await doSendFirstContributionEmail({ user, yetTocreate })
      await setFlowStatus({
        profileKey,
        flowStatus: { type: 'ongoing', sentEmails: { ...flowStatus.sentEmails, first: true } },
      })
    }
  })
}
