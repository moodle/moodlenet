import { PrimaryButton, SecondaryButton, Snackbar } from '@moodlenet/component-library'
import type { FC } from 'react'
import type { ProfileAccess, ProfileActions, ProfileState } from '../../../../../common/types.mjs'
import { ReactComponent as ApprovedIcon } from '../../../assets/icons/approved.svg'
import './ApproveButton.scss'

export type ApprovalButtonProps = {
  access: ProfileAccess
  state: ProfileState
  actions: ProfileActions
}

export const ApprovalButton: FC<ApprovalButtonProps> = ({ access, state, actions }) => {
  const { canApprove, isCreator } = access
  const {
    isWaitingApproval,
    isApproved,
    isElegibleForApproval,
    showAccountApprovedSuccessAlert,
    showApprovalRequestedSuccessAlert,
  } = state
  const { requestApproval, approveUser, unapproveUser } = actions

  const snackbars = [
    showAccountApprovedSuccessAlert && (
      <Snackbar
        position="bottom"
        type="success"
        autoHideDuration={6000}
        waitDuration={1000}
        showCloseButton={false}
      >
        Congratulations! Your account has been approved
      </Snackbar>
    ),
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

  const requestApprovalButton = isCreator && !isApproved && !isWaitingApproval && (
    <PrimaryButton
      className="request-approval-button"
      disabled={!isElegibleForApproval}
      onClick={requestApproval}
      abbr={
        isElegibleForApproval ? undefined : 'Upload 5 good-quality resources to request approval'
      }
    >
      Request approval
    </PrimaryButton>
  )

  const waitingApprovalButton = isCreator && !isApproved && isWaitingApproval && (
    <SecondaryButton className="wating-for-approval-button" disabled={true}>
      Waiting for approval
    </SecondaryButton>
  )

  const approveButton = (
    <PrimaryButton className="approve-button" onClick={approveUser} color="green">
      Approve
    </PrimaryButton>
  )

  const unapproveButton = (
    <SecondaryButton className="unapprove-button" onClick={unapproveUser} color="red">
      Unapprove
    </SecondaryButton>
  )

  return (
    <>
      {canApprove ? (isApproved ? unapproveButton : approveButton) : null}
      {isCreator && !isApproved
        ? isWaitingApproval
          ? waitingApprovalButton
          : requestApprovalButton
        : null}
      {snackbars}
    </>
  )
}

export type ApprovalInfoProps = {
  isWaitingApproval: boolean
  isApproved: boolean
  isElegibleForApproval: boolean
  isCreator: boolean
}

export const ApprovalInfo: FC<ApprovalInfoProps> = ({
  isWaitingApproval,
  isApproved,
  isElegibleForApproval,
  isCreator,
}) => {
  return isCreator && !isApproved && !isWaitingApproval ? (
    <div className="not-approved-warning">
      {isElegibleForApproval ? (
        <>
          Looks like you are starting to upload some resources!
          <br /> <br />
          Feel free to request approval to make the published ones public.
        </>
      ) : (
        <>
          We need to approve your account to make your published content public.
          <br /> <br />
          Upload 5 good-quality resources and click the button below for account approval.
        </>
      )}
    </div>
  ) : null
}

export type ApprovalBadgeProps = {
  isApproved: boolean
  isEditing: boolean
  canEdit: boolean
  showAccountApprovedSuccessAlert: boolean
}

export const ApprovalBadge: FC<ApprovalBadgeProps> = ({
  isApproved,
  canEdit,
  isEditing,
  showAccountApprovedSuccessAlert,
}) => {
  return !isEditing && canEdit && isApproved ? (
    <abbr className={`approved-icon`} title={`Approved, your published content is visible to all`}>
      <ApprovedIcon
        className={`${showAccountApprovedSuccessAlert ? 'zooom-in-enter-animation' : ''}`}
      />
    </abbr>
  ) : null
}
