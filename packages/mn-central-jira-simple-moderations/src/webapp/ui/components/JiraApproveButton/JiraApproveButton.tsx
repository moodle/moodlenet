import { PrimaryButton, SecondaryButton, Snackbar } from '@moodlenet/component-library'
import type { ProfileAccess } from '@moodlenet/web-user/common'
import type { FC } from 'react'
import './JiraApproveButton.scss'

export type ProfileJiraRequestApprovalActionsProps = {
  requestApproval: () => void
}
export type ProfileJiraRequestApprovalStateProps = {
  isElegibleForApproval: boolean
  isWaitingApproval: boolean
  showApprovalRequestedSuccessAlert: boolean
}

export type JiraRequestApprovalButtonProps = {
  access: Pick<ProfileAccess, 'isCreator' | 'isPublisher'>
  state: ProfileJiraRequestApprovalStateProps
  actions: ProfileJiraRequestApprovalActionsProps
}

export const JiraRequestApprovalButton: FC<JiraRequestApprovalButtonProps> = ({
  access,
  state,
  actions,
}) => {
  const { isCreator, isPublisher } = access
  const { isWaitingApproval, isElegibleForApproval, showApprovalRequestedSuccessAlert } = state
  const { requestApproval } = actions

  const snackbars = [
    showApprovalRequestedSuccessAlert && (
      <Snackbar
        position="bottom"
        type="success"
        autoHideDuration={6000}
        waitDuration={1000}
        showCloseButton={false}
      >
        Request send! We will review your account and get back to you soon
      </Snackbar>
    ),
  ]

  const requestJiraRequestApprovalButton = isCreator && !isPublisher && !isWaitingApproval && (
    <PrimaryButton
      className="request-jira-approve-button"
      disabled={!isElegibleForApproval}
      onClick={requestApproval}
      abbr={
        isElegibleForApproval ? undefined : 'Upload 5 good-quality resources to request approval'
      }
    >
      Request approval
    </PrimaryButton>
  )

  const waitingJiraRequestApprovalButton = isCreator && !isPublisher && isWaitingApproval && (
    <SecondaryButton className="wating-for-jira-approve-button" disabled={true}>
      Waiting for approval
    </SecondaryButton>
  )

  return (
    <>
      {isCreator && !isPublisher
        ? isWaitingApproval
          ? waitingJiraRequestApprovalButton
          : requestJiraRequestApprovalButton
        : null}
      {snackbars}
    </>
  )
}

export type JiraRequestApprovalInfoProps = {
  isWaitingApproval: boolean
  isPublisher: boolean
  isElegibleForApproval: boolean
  isCreator: boolean
}

export const JiraRequestApprovalInfo: FC<JiraRequestApprovalInfoProps> = ({
  isWaitingApproval,
  isPublisher,
  isElegibleForApproval,
  isCreator,
}) => {
  return isCreator && !isPublisher && !isWaitingApproval ? (
    isElegibleForApproval ? (
      <div className="not-approved-warning elegible">
        Looks like you are starting to upload some resources!
        <br /> <br />
        Feel free to request approval so others can see your content.
      </div>
    ) : (
      <div className="not-approved-warning not-elegible">
        Become an approved publisher so that others can see your content.
        {/* We need to approve your account for others to see your content. */}
        <br /> <br />
        Upload 5 good-quality resources and click the button below for account approval.
      </div>
    )
  ) : null
}
