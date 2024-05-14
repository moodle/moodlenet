import { getOrgData } from '@moodlenet/organization/server'
import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { shell } from '../shell.mjs'
import {
  doSendFirstContributionEmail,
  doSendLastContributionEmail,
  readApprovalFlowStatus,
  setProfileAsPublisher,
} from '../srv.mjs'

export async function webUserCreatedResource({ profileKey }: { profileKey: string }) {
  return shell.initiateCall(async () => {
    await setPkgCurrentUser()
    const flowStatus = await readApprovalFlowStatus({ profileKey })
    if (flowStatus.type === 'ended' || flowStatus.type === 'no-webuser-email') {
      return
    }
    const { amountForAutoApproval, currentCreatedResourceLeastAmount, sentEmails, user } =
      flowStatus
    const yetTocreate = amountForAutoApproval - currentCreatedResourceLeastAmount
    if (yetTocreate === 0) {
      await setProfileAsPublisher({ profileKey, flowStatus })
    } else if (yetTocreate === 1 && !sentEmails.last) {
      doSendLastContributionEmail({
        user,
        profileKey,
        flowStatus,
        currentCreatedResourceLeastAmount,
      })
    } else if (currentCreatedResourceLeastAmount === 1 && !sentEmails.first) {
      const {
        data: { instanceName },
      } = await getOrgData()
      doSendFirstContributionEmail({ user, profileKey, flowStatus, instanceName, yetTocreate })
    }
  })
}
