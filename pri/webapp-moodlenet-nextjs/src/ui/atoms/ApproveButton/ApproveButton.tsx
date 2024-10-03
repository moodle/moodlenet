import { ReactComponent as ApprovedIcon } from '../../../ui/lib/assets/icons/approved.svg'
import { PrimaryButton } from '../PrimaryButton/PrimaryButton'
import { SecondaryButton } from '../SecondaryButton/SecondaryButton'
import './ApproveButton.scss'

export type ApprovalButtonProps = {
  isApproved: boolean
  toggleIsApproved: () => void
}

export function ApprovalButton({ isApproved, toggleIsApproved }: ApprovalButtonProps) {
  return isApproved ? (
    <SecondaryButton className="unapprove-button" onClick={toggleIsApproved} color="red">
      Unapprove
    </SecondaryButton>
  ) : (
    <PrimaryButton className="approve-button" onClick={toggleIsApproved} color="green">
      Approve
    </PrimaryButton>
  )
}

export type ApprovalInfoProps = {
  isWaitingApproval: boolean
  isPublisher: boolean
  isElegibleForApproval: boolean
  isCreator: boolean
}

export type ApprovalBadgeProps = {
  isPublisher: boolean
  isEditing: boolean
  canEdit: boolean
  showAccountApprovedSuccessAlert: boolean
}

export function ApprovalBadge({
  isPublisher,
  canEdit,
  isEditing,
  showAccountApprovedSuccessAlert,
}: ApprovalBadgeProps) {
  return !isEditing && canEdit && isPublisher ? (
    <abbr className={`approved-badge`} title={`Approved, your published content is visible to all`}>
      <ApprovedIcon
        className={`approved-icon ${
          showAccountApprovedSuccessAlert ? 'zooom-in-enter-animation' : ''
        }`}
      />
    </abbr>
  ) : null
}
