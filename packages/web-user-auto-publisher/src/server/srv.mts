import { CREATE_RESOURCE_PAGE_ROUTE_PATH } from '@moodlenet/ed-resource/common'
import { send } from '@moodlenet/email-service/server'
import { getOrgData } from '@moodlenet/organization/server'
import { getWebappUrl } from '@moodlenet/react-app/server'
import {
  changeProfilePublisherPerm,
  getProfileOwnKnownEntities,
  getWebUserByProfileKey,
} from '@moodlenet/web-user/server'
import { firstContributionEmail } from '../common/emails/FirstContributionEmail.js'
import { lastContributionEmail } from '../common/emails/LastContributionEmail.js'
import { welcomeEmail } from '../common/emails/WelcomeEmail.js'
import type { ReadFlowStatus, UserDetails } from './ctrl/types.mjs'
import { env } from './env.mjs'
import type { FlowStatus } from './init/kvStore.mjs'
import { kvStore } from './init/kvStore.mjs'
const NO_SENT_EMAILS = { last: false, first: false, welcome: false } as const

export async function readApprovalFlowStatus({
  profileKey,
}: {
  profileKey: string
}): Promise<ReadFlowStatus> {
  const { amountForAutoApproval } = env
  const webUser = await getWebUserByProfileKey({ profileKey })

  if (webUser?.publisher) {
    return setFlowStatus({ profileKey, flowStatus: { type: 'ended', sentEmails: NO_SENT_EMAILS } })
  }
  if (!webUser?.contacts.email) {
    return setFlowStatus({
      profileKey,
      flowStatus: { type: 'no-webuser-email', sentEmails: NO_SENT_EMAILS },
    })
  }

  const flowStatus =
    (await getFlowStatus(profileKey)) ??
    (await setFlowStatus({
      profileKey,
      flowStatus: { type: 'ongoing', sentEmails: NO_SENT_EMAILS },
    }))

  if (flowStatus.type === 'no-webuser-email') {
    return { type: flowStatus.type }
  }
  if (flowStatus.type === 'ended') {
    return { type: flowStatus.type, sentEmails: flowStatus.sentEmails }
  }
  const currentCreatedResourceLeastAmount = await getCurrentCreatedResourceLeastAmount(
    profileKey,
    amountForAutoApproval,
  )
  flowStatus.type === 'ongoing'
  return {
    type: flowStatus.type,
    currentCreatedResourceLeastAmount,
    amountForAutoApproval,
    sentEmails: flowStatus.sentEmails,
    user: {
      displayName: webUser.displayName,
      email: webUser.contacts.email,
    },
  }
}

async function getCurrentCreatedResourceLeastAmount(
  profileKey: string,
  amountForAutoApproval: number,
): Promise<number> {
  const currentCreatedResourceLeastAmountList = await getProfileOwnKnownEntities({
    profileKey,
    knownEntity: 'resource',
    limit: amountForAutoApproval,
  })
  return currentCreatedResourceLeastAmountList.length
}

export async function setFlowStatus<FS extends FlowStatus>({
  flowStatus,
  profileKey,
}: {
  profileKey: string
  flowStatus: FS
}): Promise<FS> {
  await kvStore.set('flow-status', profileKey, flowStatus)
  return flowStatus
}

export async function getFlowStatus(profileKey: string) {
  return (await kvStore.get('flow-status', profileKey)).value
}
export async function delFlowStatus({ profileKey }: { profileKey: string }) {
  await kvStore.unset('flow-status', profileKey)
}

export async function doSendLastContributionEmail({
  user,
  currentCreatedResourceLeastAmount,
}: {
  user: UserDetails
  currentCreatedResourceLeastAmount: number
}) {
  await send(
    lastContributionEmail({
      amountSoFar: currentCreatedResourceLeastAmount,
      keepContributingActionUrl: getWebappUrl(CREATE_RESOURCE_PAGE_ROUTE_PATH),
      receiverEmail: user.email,
    }),
  )
}
export async function doSendFirstContributionEmail({
  user,
  yetTocreate,
}: {
  user: UserDetails
  yetTocreate: number
}) {
  const {
    data: { instanceName },
  } = await getOrgData()
  await send(
    firstContributionEmail({
      yetTocreate,
      keepContributingActionUrl: getWebappUrl(CREATE_RESOURCE_PAGE_ROUTE_PATH),
      instanceName,
      receiverEmail: user.email,
    }),
  )
}

export async function setProfileAsPublisher({ profileKey }: { profileKey: string }) {
  await changeProfilePublisherPerm({
    profileKey,
    setIsPublisher: true,
    forceUnpublish: false,
  })
}

export async function doSendWelcomeEmail({ user: { displayName, email } }: { user: UserDetails }) {
  const orgData = await getOrgData()
  await send(
    welcomeEmail({
      amountResourceToGainPublishingRights: env.amountForAutoApproval,
      contributeActionUrl: getWebappUrl(CREATE_RESOURCE_PAGE_ROUTE_PATH),
      receiverEmail: email,
      displayName,
      instanceName: orgData.data.instanceName,
    }),
  )
}
