import { getResourceValidationSchemas, map } from '@moodlenet/ed-resource/server'
import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import {
  getProfileOwnKnownEntities,
  getWebUser,
  getWebUserByProfileKey,
  unsetTokenContext,
} from '@moodlenet/web-user/server'
import { getContributionStatus } from './control.mjs'
import { env } from './env.mjs'
import { kvStore } from './init/kvStore.mjs'
import { shell } from './shell.mjs'
import type { FlowStatus, ResourceAmounts, UserDetails } from './types.mjs'

export function initiateAsMe<F extends () => any>(f: F) {
  return shell.initiateCall(async () => {
    await unsetTokenContext()
    await setPkgCurrentUser()
    return f()
  })
}
export async function getUserDetails(key: { webUserKey: string } | { profileKey: string }) {
  const webUser = await ('profileKey' in key
    ? getWebUserByProfileKey({ profileKey: key.profileKey })
    : getWebUser({ _key: key.webUserKey }))

  if (!webUser?.contacts.email) {
    return
  }
  const userDetails: UserDetails = {
    webUserkey: webUser._key,
    displayName: webUser.displayName,
    email: webUser.contacts.email,
    publisher: webUser.publisher,
    deleted: webUser.deleted === true,
  }
  return userDetails
}
export async function fetchContributionStatus({ profileKey }: { profileKey: string }) {
  const { amountForAutoApproval } = env
  const currentCreatedResourceList = await getProfileOwnKnownEntities({
    profileKey,
    knownEntity: 'resource',
    limit: 100000,
  })
  const currentPublishableResourceList = currentCreatedResourceList.filter(({ entity }) => {
    if (entity.persistentContext.state !== 'Unpublished') {
      return false
    }
    const schemas = getResourceValidationSchemas()

    const publishingErrors = schemas.publishable(
      map.db.doc_2_persistentContext(entity).doc.meta,
    ).errors

    return !publishingErrors
  })
  const currentPublishableResourceAmount = currentPublishableResourceList.length
  const currentCreatedResourceAmount = currentCreatedResourceList.length

  const resourceAmounts: ResourceAmounts = {
    amountForAutoApproval,
    currentPublishableResourceAmount,
    currentCreatedResourceAmount,
  }
  return getContributionStatus({ resourceAmounts })
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

export async function getFlowStatus({ profileKey }: { profileKey: string }) {
  return (await kvStore.get('flow-status', profileKey)).value
}
export async function delFlowStatus({ profileKey }: { profileKey: string }) {
  await kvStore.unset('flow-status', profileKey)
}

/*
export async function updateFlowStatus({
  profileKey,
  map,
}: {
  profileKey: string
  map: (flowStatus: FlowStatus | undefined) => FlowStatus | undefined
}): Promise<FlowStatus | undefined> {
  const currFlowStatus = await getFlowStatus({ profileKey })
  const newFlowStatus = map(currFlowStatus)
  if (!newFlowStatus) {
    await delFlowStatus({ profileKey })
    return undefined
  }
  await setFlowStatus({ profileKey, flowStatus: newFlowStatus })
  return newFlowStatus
}
 */
