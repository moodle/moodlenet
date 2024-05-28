import type { EntityIdentifier } from '@moodlenet/system-entities/common'
import { isOfSameClass } from '@moodlenet/system-entities/common'
import { Profile, on } from '@moodlenet/web-user/server'
import {
  deletedUserActions,
  enoughPublishableActions,
  firstContributionActions,
  lastContributionActions,
  secondLastContributionActions,
  userApprovedActions,
  welcomeActions,
} from '../actions.mjs'
import {
  ongoingNextAction,
  profileCreated,
  profileDeleted,
  userPublisherPermissionChange,
} from '../control.mjs'
import { env } from '../env.mjs'
import { fetchContributionStatus, getFlowStatus, getUserDetails } from '../srv.mjs'
if (!env.noBgProc) {
  on('created-web-user-account', async ({ data: { profileKey, webUserKey } }) => {
    // console.log('created-web-user-account', profileKey)
    const userDetails = await getUserDetails({ webUserKey })
    if (!userDetails) {
      return
    }
    const todo = await profileCreated({ isPublisher: userDetails.publisher })
    switch (todo) {
      case 'welcome': {
        await welcomeActions({ userDetails, profileKey })
        break
      }
      case 'approved': {
        await userApprovedActions({ profileKey })
      }
    }
  })

  on(
    'deleted-web-user-account',
    async ({
      data: {
        profile: { _key: profileKey },
      },
    }) => {
      const todo = await profileDeleted()
      switch (todo) {
        case 'delete': {
          await deletedUserActions({ profileKey })
          break
        }
      }
    },
  )

  on('resource-updated-meta', async ({ data: { userId } }) => ongoingHandler({ userId }))

  on('resource-created', async ({ data: { userId } }) => ongoingHandler({ userId }))

  on(
    'user-publishing-permission-change',
    async ({
      data: {
        profile: { _key: profileKey },
        type,
      },
    }) => {
      const todo = userPublisherPermissionChange({ permission: type })
      switch (todo) {
        case 'approved': {
          userApprovedActions({ profileKey })
          break
        }
        case null: {
          break
        }
      }
    },
  )
}

async function ongoingHandler({ userId }: { userId: EntityIdentifier }) {
  const profileKey = isOfSameClass(Profile.entityClass, userId.entityClass) ? userId._key : null

  if (!profileKey) {
    return
  }

  const flowStatus = await getFlowStatus({ profileKey })
  if (flowStatus?.status !== 'ongoing') {
    return
  }

  const contributionStatus = await fetchContributionStatus({ profileKey })
  const action = ongoingNextAction({ contributionStatus, flowStatus })

  const { userDetails } = flowStatus
  const { yetToCreate, currentCreatedResourceAmount } = contributionStatus
  switch (action) {
    case 'none': {
      break
    }
    case 'user gains publishing permission': {
      await enoughPublishableActions({ profileKey })
      break
    }
    case 'first contribution actions': {
      await firstContributionActions({ userDetails, yetToCreate, profileKey })
      break
    }
    case 'last contribution actions': {
      await lastContributionActions({
        currentCreatedResourceAmount,
        profileKey,
        userDetails,
      })
      break
    }
    case 'second-last contribution actions': {
      secondLastContributionActions({ currentCreatedResourceAmount, userDetails, profileKey })
      break
    }
  }
  return { action, contributionStatus }
}
