import { send } from '@moodlenet/email-service/server'
import { getWebappUrl } from '@moodlenet/react-app/server'
import { getProfileHomePageRoutePath } from '@moodlenet/web-user/common'
import {
  changeProfilePublisherPerm,
  getProfileOwnKnownEntities,
  getWebUserByProfileKey,
} from '@moodlenet/web-user/server'
import { firstContributionEmail } from '../common/emails/FirstContributionEmail/FirstContributionEmail.js'
import { lastContributionEmail } from '../common/emails/LastContributionEmail/LastContributionEmail.js'
import type { ReadFlowStatus, UserDetails } from './ctrl/types.mjs'
import { env } from './env.mjs'
import type { FlowStatus } from './init/kvStore.mjs'
import { kvStore } from './init/kvStore.mjs'
type StatusType = ReadFlowStatus['type']
function defaultFlowStatusValue<S extends StatusType>(type: S): FlowStatus & { type: S } {
  return {
    type,
    sentEmails: { last: false, first: false },
  }
}

export async function readApprovalFlowStatus({
  profileKey,
}: {
  profileKey: string
}): Promise<ReadFlowStatus> {
  const { amountForAutoApproval } = env
  const webUser = await getWebUserByProfileKey({ profileKey })

  if (webUser?.publisher) {
    return setFlowStatus(profileKey, defaultFlowStatusValue('ended'))
  }
  if (!webUser?.contacts.email) {
    return setFlowStatus(profileKey, defaultFlowStatusValue('no-webuser-email'))
  }

  const flowStatus =
    (await getFlowStatus(profileKey)) ??
    (await setFlowStatus(profileKey, defaultFlowStatusValue('ongoing')))

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

export async function setFlowStatus<FS extends FlowStatus>(
  profileKey: string,
  flowStatus: FS,
): Promise<FS> {
  await kvStore.set('flow-status', profileKey, flowStatus)
  return flowStatus
}
export async function getFlowStatus(profileKey: string) {
  return (await kvStore.get('flow-status', profileKey)).value
}
export async function doSendLastContributionEmail({
  profileKey,
  user,
  currentCreatedResourceLeastAmount,
  flowStatus,
}: {
  user: UserDetails
  profileKey: string
  currentCreatedResourceLeastAmount: number
  flowStatus: FlowStatus
}) {
  if (flowStatus.type !== 'ongoing') {
    return
  }
  await send(
    lastContributionEmail({
      amountSoFar: currentCreatedResourceLeastAmount,
      keepContributingActionUrl: getWebappUrl(
        getProfileHomePageRoutePath({
          _key: profileKey,
          displayName: user.displayName,
        }),
      ),
      receiverEmail: user.email,
    }),
  )
  setFlowStatus(profileKey, {
    type: 'ongoing',
    sentEmails: { first: flowStatus.sentEmails.first, last: true },
  })
}
export async function doSendFirstContributionEmail({
  profileKey,
  user,
  yetTocreate,
  flowStatus,
  instanceName,
}: {
  user: UserDetails
  profileKey: string
  yetTocreate: number
  flowStatus: FlowStatus
  instanceName: string
}) {
  if (flowStatus.type !== 'ongoing') {
    return
  }
  await send(
    firstContributionEmail({
      yetTocreate,
      keepContributingActionUrl: getWebappUrl(
        getProfileHomePageRoutePath({
          _key: profileKey,
          displayName: user.displayName,
        }),
      ),
      instanceName,
      receiverEmail: user.email,
    }),
  )
  setFlowStatus(profileKey, { type: 'ongoing', sentEmails: { last: false, first: true } })
}

export async function setProfileAsPublisher({
  profileKey,
  flowStatus,
}: {
  profileKey: string
  flowStatus: FlowStatus
}) {
  if (flowStatus.type !== 'ongoing') {
    return
  }
  await changeProfilePublisherPerm({
    profileKey,
    setIsPublisher: true,
    forceUnpublish: false,
  })

  await setFlowStatus(profileKey, { type: 'ended', sentEmails: flowStatus.sentEmails })
}
