import type { ContributionStatus, FlowStatus, Ongoing, ResourceAmounts } from './types.mjs'

export function userPublisherPermissionChange({ permission }: { permission: 'given' | 'revoked' }) {
  return permission === 'given' ? ('approved' as const) : null
}

export async function profileDeleted() {
  return 'delete' as const
}

export async function profileCreated({ isPublisher }: { isPublisher: boolean }) {
  return isPublisher ? ('approved' as const) : ('welcome' as const)
}

export function ongoingNextAction({
  flowStatus,
  contributionStatus,
}: {
  contributionStatus: ContributionStatus
  flowStatus: FlowStatus & Ongoing
}) {
  const action = (() => {
    switch (contributionStatus.status) {
      case 'none':
        return false

      case 'enough publishable':
        return 'user gains publishing permission' as const

      case 'last contribution':
        return flowStatus.step !== 'last-resource-created' && ('last contribution actions' as const)

      case 'second last contribution':
        return (
          (flowStatus.step === 'first-resource-created' || flowStatus.step === 'welcome') &&
          ('second-last contribution actions' as const)
        )

      case 'first contribution':
        return flowStatus.step === 'welcome' && ('first contribution actions' as const)
    }
  })()
  return action || 'none'
}

export function getContributionStatus({
  resourceAmounts,
}: {
  resourceAmounts: ResourceAmounts
}): ContributionStatus {
  const { amountForAutoApproval, currentCreatedResourceAmount, currentPublishableResourceAmount } =
    resourceAmounts
  const yetToMakePublishable = amountForAutoApproval - currentPublishableResourceAmount
  const yetToCreate = amountForAutoApproval - currentCreatedResourceAmount

  const status: ContributionStatus['status'] =
    yetToMakePublishable <= 0
      ? ('enough publishable' as const)
      : yetToCreate <= 0
        ? ('last contribution' as const)
        : yetToCreate === 1
          ? ('second last contribution' as const)
          : currentCreatedResourceAmount === 1
            ? ('first contribution' as const)
            : 'none'
  const resourceAmountsStatus: ContributionStatus = {
    status,
    yetToMakePublishable,
    yetToCreate,
    ...resourceAmounts,
  }
  return resourceAmountsStatus
}
