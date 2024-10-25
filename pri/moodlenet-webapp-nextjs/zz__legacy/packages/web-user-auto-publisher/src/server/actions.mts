import { CREATE_RESOURCE_PAGE_ROUTE_PATH } from '@moodlenet/ed-resource/common'
import { send } from '@moodlenet/email-service/server'
import { getOrgData } from '@moodlenet/organization/server'
import { getWebappUrl } from '@moodlenet/react-app/server'
import { getProfileHomePageRoutePath } from '@moodlenet/web-user/common'
import { changeProfilePublisherPerm } from '@moodlenet/web-user/server'
import { firstContributionEmail } from '../common/emails/FirstContributionEmail'
import { lastContributionEmail } from '../common/emails/LastContributionEmail'
import { secondLastContributionEmail } from '../common/emails/SecondLastContributionEmail'
import { welcomeEmail } from '../common/emails/WelcomeEmail'
import { env } from './env.mjs'
import { delFlowStatus, setFlowStatus } from './srv.mjs'
import type { UserDetails } from './types.mjs'

export async function userApprovedActions({ profileKey }: { profileKey: string }) {
  await setFlowStatus({
    profileKey,
    flowStatus: { status: 'approved', step: 'final' },
  })
}
export async function deletedUserActions({ profileKey }: { profileKey: string }) {
  await delFlowStatus({ profileKey })
}

export async function lastContributionActions({
  userDetails,
  currentCreatedResourceAmount,
  profileKey,
}: {
  userDetails: UserDetails
  currentCreatedResourceAmount: number
  profileKey: string
}) {
  await send(
    lastContributionEmail({
      receiverEmail: userDetails.email,
      createdAmount: currentCreatedResourceAmount,
      homePageActionUrl: getWebappUrl(
        getProfileHomePageRoutePath({ _key: profileKey, displayName: userDetails.displayName }),
      ),
    }),
  )

  await setFlowStatus({
    profileKey,
    flowStatus: {
      status: 'ongoing',
      step: 'last-resource-created',
      userDetails,
    },
  })
}
export async function secondLastContributionActions({
  userDetails,
  profileKey,
  currentCreatedResourceAmount,
}: {
  userDetails: UserDetails
  currentCreatedResourceAmount: number
  profileKey: string
}) {
  await send(
    secondLastContributionEmail({
      createdAmountSoFar: currentCreatedResourceAmount,
      keepContributingActionUrl: getWebappUrl(CREATE_RESOURCE_PAGE_ROUTE_PATH),
      receiverEmail: userDetails.email,
    }),
  )
  await setFlowStatus({
    profileKey,
    flowStatus: {
      status: 'ongoing',
      step: 'second-last-resource-created',
      userDetails,
    },
  })
}
export async function firstContributionActions({
  userDetails,
  yetToCreate,
  profileKey,
}: {
  profileKey: string
  userDetails: UserDetails
  yetToCreate: number
}) {
  const {
    data: { instanceName },
  } = await getOrgData()
  await send(
    firstContributionEmail({
      yetToCreate,
      keepContributingActionUrl: getWebappUrl(CREATE_RESOURCE_PAGE_ROUTE_PATH),
      instanceName,
      receiverEmail: userDetails.email,
    }),
  )
  await setFlowStatus({
    profileKey,
    flowStatus: { status: 'ongoing', step: 'first-resource-created', userDetails },
  })
}

export async function enoughPublishableActions({ profileKey }: { profileKey: string }) {
  await changeProfilePublisherPerm({
    profileKey,
    setIsPublisher: true,
    forceUnpublish: false,
  })
}

export async function welcomeActions({
  userDetails,
  profileKey,
}: {
  userDetails: UserDetails
  profileKey: string
}) {
  const orgData = await getOrgData()
  await send(
    welcomeEmail({
      amountResourceToGainPublishingRights: env.amountForAutoApproval,
      contributeActionUrl: getWebappUrl(CREATE_RESOURCE_PAGE_ROUTE_PATH),
      receiverEmail: userDetails.email,
      displayName: userDetails.displayName,
      instanceName: orgData.data.instanceName,
    }),
  )
  await setFlowStatus({
    profileKey,
    flowStatus: { status: 'ongoing', step: 'welcome', userDetails },
  })
}
