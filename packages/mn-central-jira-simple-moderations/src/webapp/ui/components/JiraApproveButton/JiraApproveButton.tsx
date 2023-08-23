import { PrimaryButton, SecondaryButton, Snackbar } from '@moodlenet/component-library'
import type { ProfileAccess, ProfileActions, ProfileState } from '@moodlenet/web-user/common'
import type { FC } from 'react'
import './JiraApproveButton.scss'

export type ProfileJiraApproveActionsProps = ProfileActions & {
  requestApproval: () => void
}
export type ProfileJiraApproveStateProps = ProfileState & {
  isElegibleForApproval: boolean
  isWaitingApproval: boolean
  showApprovalRequestedSuccessAlert: boolean
}

export type JiraApproveButtonProps = {
  access: ProfileAccess
  state: ProfileJiraApproveStateProps
  actions: ProfileJiraApproveActionsProps
}

export const JiraApproveButton: FC<JiraApproveButtonProps> = ({ access, state, actions }) => {
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

  const requestJiraApproveButton = isCreator && !isPublisher && !isWaitingApproval && (
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

  const waitingJiraApproveButton = isCreator && !isPublisher && isWaitingApproval && (
    <SecondaryButton className="wating-for-jira-approve-button" disabled={true}>
      Waiting for approval
    </SecondaryButton>
  )

  return (
    <>
      {isCreator && !isPublisher
        ? isWaitingApproval
          ? waitingJiraApproveButton
          : requestJiraApproveButton
        : null}
      {snackbars}
    </>
  )
}

export type ApprovalInfoProps = {
  isWaitingApproval: boolean
  isPublisher: boolean
  isElegibleForApproval: boolean
  isCreator: boolean
}

export const ApprovalInfo: FC<ApprovalInfoProps> = ({
  isWaitingApproval,
  isPublisher,
  isElegibleForApproval,
  isCreator,
}) => {
  return isCreator && !isPublisher && !isWaitingApproval ? (
    <div className="not-approved-warning">
      {isElegibleForApproval ? (
        <>
          Looks like you are starting to upload some resources!
          <br /> <br />
          Feel free to request approval so others can see your content.
        </>
      ) : (
        <>
          We need to approve your account for others to see your content.
          <br /> <br />
          Upload 5 good-quality resources and click the button below for account approval.
        </>
      )}
    </div>
  ) : null
}
