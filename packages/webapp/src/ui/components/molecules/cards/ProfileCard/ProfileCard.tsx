import { t, Trans } from '@lingui/macro'
import EditIcon from '@material-ui/icons/Edit'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import SaveIcon from '@material-ui/icons/Save'
import React, { useRef, useState } from 'react'
import { ReactComponent as ApprovedIcon } from '../../../../assets/icons/approved.svg'
import { withCtrl } from '../../../../lib/ctrl'
import { FormikHandle } from '../../../../lib/formik'
import { useImageUrl } from '../../../../lib/useImageUrl'
import defaultAvatar from '../../../../static/img/default-avatar.svg'
import defaultBackgroud from '../../../../static/img/default-background.svg'
import { InputTextField } from '../../../atoms/InputTextField/InputTextField'
import Modal from '../../../atoms/Modal/Modal'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import RoundButton from '../../../atoms/RoundButton/RoundButton'
import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton'
import { ProfileFormValues } from '../../../pages/Profile/types'
import './styles.scss'

export type ProfileCardProps = {
  isOwner?: boolean
  isAdmin?: boolean
  isApproved?: boolean
  isElegibleForApproval?: boolean
  isWaitingApproval?: boolean
  isFollowing?: boolean
  isEditing?: boolean
  isAuthenticated: boolean
  editForm: FormikHandle<ProfileFormValues>
  toggleIsEditing(): unknown
  openSendMessage(): unknown
  toggleFollowForm: FormikHandle<{}>
  requestApprovalForm: FormikHandle<{}>
  approveUserForm: FormikHandle<{}>
  unapproveUserForm: FormikHandle<{}>
  showAccountApprovedSuccessAlert?: boolean
}

export const ProfileCard = withCtrl<ProfileCardProps>(
  ({
    isOwner,
    isAdmin,
    isApproved,
    isElegibleForApproval,
    showAccountApprovedSuccessAlert,
    isWaitingApproval,
    isAuthenticated,
    isEditing,
    isFollowing,
    editForm,
    openSendMessage,
    toggleFollowForm,
    toggleIsEditing,
    approveUserForm,
    requestApprovalForm,
    unapproveUserForm,
  }) => {
    const [isShowingAvatar, setIsShowingAvatar] = useState<boolean>(false)
    const shouldShowErrors = !!editForm.submitCount
    const [isShowingBackground, setIsShowingBackground] =
      useState<boolean>(false)

    // const handleOnSaveClick = () => {
    //   if (editForm.isValid) {
    //     setShouldShowErrors(false)
    //     toggleIsEditing()
    //   } else {
    //     setShouldShowErrors(true)
    //   }
    // }

    const uploadBackgroundRef = useRef<HTMLInputElement>(null)
    const selectBackground = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      uploadBackgroundRef.current?.click()
    }

    const uploadAvatarRef = useRef<HTMLInputElement>(null)
    const selectAvatar = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      uploadAvatarRef.current?.click()
    }

    const uploadBackground = (e: React.ChangeEvent<HTMLInputElement>) =>
      editForm.setFieldValue('backgroundImage', e.currentTarget.files?.item(0))

    const uploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) =>
      editForm.setFieldValue('avatarImage', e.currentTarget.files?.item(0))

    const [backgroundUrl] = useImageUrl(
      editForm.values.backgroundImage,
      defaultBackgroud
    )
    const background = {
      backgroundImage: 'url(' + backgroundUrl + ')',
      backgroundSize: 'cover',
    }

    const [avatarUrl] = useImageUrl(editForm.values.avatarImage, defaultAvatar)
    const avatar = {
      backgroundImage: 'url(' + avatarUrl + ')',
      backgroundSize: 'cover',
    }

    return (
      <div className="profile-card">
        {isShowingBackground && backgroundUrl && (
          <Modal
            className="image-modal"
            closeButton={false}
            onClose={() => setIsShowingBackground(false)}
            style={{ maxWidth: '90%', maxHeight: '90%' }}
          >
            <img src={backgroundUrl} alt="Background" />
          </Modal>
        )}
        {isShowingAvatar && avatarUrl && (
          <Modal
            className="image-modal"
            closeButton={false}
            onClose={() => setIsShowingAvatar(false)}
            style={{ maxWidth: '90%', maxHeight: '90%' }}
          >
            <img src={avatarUrl} alt="Avatar" />
          </Modal>
        )}
        <div
          className="background"
          style={background}
          onClick={() => !isEditing && setIsShowingBackground(true)}
        >
          {isEditing && (
            <input
              ref={uploadBackgroundRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={uploadBackground}
              hidden
            />
          )}
          {isEditing && (
            <RoundButton
              className="change-background-button"
              type="edit"
              onClick={selectBackground}
            />
          )}
        </div>

        <div className="avatar-and-actions">
          <div
            className="avatar"
            style={avatar}
            onClick={() => !isEditing && setIsShowingAvatar(true)}
          >
            {isEditing && (
              <input
                ref={uploadAvatarRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={uploadAvatar}
                hidden
              />
            )}
            {isEditing && (
              <RoundButton
                className="change-avatar-button"
                type="edit"
                onClick={selectAvatar}
              />
            )}
          </div>
          {isOwner && (
            <div className="actions edit-save">
              {isEditing ? (
                <PrimaryButton color="green" onClick={toggleIsEditing}>
                  <SaveIcon />
                </PrimaryButton>
              ) : (
                <SecondaryButton onClick={toggleIsEditing} color="orange">
                  <EditIcon />
                </SecondaryButton>
              )}
            </div>
          )}
        </div>

        <div className="info">
          <div className="profile-card-header">
            <div className="title">
              {isOwner && isEditing ? (
                <InputTextField
                  className="display-name underline"
                  placeholder="Display name"
                  value={editForm.values.displayName}
                  onChange={editForm.handleChange}
                  name="displayName"
                  displayMode={true}
                  edit={isEditing}
                  error={
                    isEditing && shouldShowErrors && editForm.errors.displayName
                  }
                />
              ) : (
                <div className="display-name">
                  {editForm.values.displayName}
                </div>
              )}
              {!isEditing && isApproved && (
                <abbr className={`approved-icon`} title={t`Approved user`}>
                  <ApprovedIcon
                    className={`${
                      showAccountApprovedSuccessAlert
                        ? 'zooom-in-enter-animation'
                        : ''
                    }`}
                  />
                </abbr>
              )}
            </div>
            {isOwner && isEditing ? (
              <div className="subtitle edit">
                <span>
                  <span className="at-symbol">@</span>
                  <InputTextField
                    className="underline"
                    placeholder="Display Name"
                    value={editForm.values.displayName}
                    onChange={editForm.handleChange}
                    displayMode={true}
                    name="displayName"
                    edit={isEditing}
                    error={
                      isEditing &&
                      shouldShowErrors &&
                      editForm.errors.displayName
                    }
                  />
                </span>
                <span>
                  <InputTextField
                    className="underline"
                    displayMode={true}
                    value={editForm.values.organizationName}
                    onChange={editForm.handleChange}
                    placeholder="Organization"
                    name="organizationName"
                    edit={isEditing}
                    error={
                      isEditing &&
                      shouldShowErrors &&
                      editForm.errors.organizationName
                    }
                  />
                </span>
                <span>
                  <InputTextField
                    className="underline"
                    placeholder="Location"
                    value={editForm.values.location}
                    onChange={editForm.handleChange}
                    displayMode={true}
                    name="location"
                    edit={isEditing}
                    error={
                      isEditing && shouldShowErrors && editForm.errors.location
                    }
                  />
                </span>
                <span>
                  <InputTextField
                    className="underline"
                    value={editForm.values.siteUrl}
                    onChange={editForm.handleChange}
                    displayMode={true}
                    placeholder="Website"
                    name="siteUrl"
                    edit={isEditing}
                    error={
                      isEditing && shouldShowErrors && editForm.errors.siteUrl
                    }
                  />
                </span>
              </div>
            ) : (
              <div className="subtitle">
                {editForm.values.displayName && (
                  <span>
                    <span className="at-symbol">@</span>
                    {editForm.values.displayName}
                  </span>
                )}
                {editForm.values.organizationName !== '' && (
                  <span>{editForm.values.organizationName}</span>
                )}
                {editForm.values.location !== '' && (
                  <span>{editForm.values.location}</span>
                )}
                {editForm.values.siteUrl !== '' && (
                  <a
                    href={editForm.values.siteUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {editForm.values.siteUrl}
                  </a>
                )}
              </div>
            )}
            {/* {profileCardErrorMessage && (
              <div className="error">{profileCardErrorMessage}</div>
            )} */}
          </div>
          {isOwner ? (
            <InputTextField
              textAreaAutoSize={true}
              value={editForm.values.description}
              onChange={editForm.handleChange}
              textarea={true}
              displayMode={true}
              className="underline"
              placeholder="What should others know about you?"
              name="description"
              edit={isEditing}
              error={
                isEditing && shouldShowErrors && editForm.errors.description
              }
            />
          ) : (
            <div className="description">{editForm.values.description}</div>
          )}
          {isOwner && !isApproved && !isWaitingApproval && (
            <div className="not-approved-warning">
              {isElegibleForApproval ? (
                <Trans>
                  We need to approve your account to make your content public.
                  Press the button below for account approval.
                </Trans>
              ) : (
                <Trans>
                  We need to approve your account to make your content public.
                  Upload 5 good-quality resources and click the button below for
                  account approval.
                </Trans>
              )}
            </div>
          )}
          <div className="buttons">
            {isOwner && !isApproved && !isWaitingApproval && (
              <PrimaryButton
                disabled={!isElegibleForApproval}
                onClick={requestApprovalForm.submitForm}
              >
                <Trans>Request approval</Trans>
              </PrimaryButton>
            )}
            {isOwner && isWaitingApproval && (
              <SecondaryButton disabled={true}>
                <Trans>Waiting for approval</Trans>
              </SecondaryButton>
            )}
            {isAdmin && !isApproved && (
              <PrimaryButton onClick={approveUserForm.submitForm} color="green">
                <Trans>Approve</Trans>
              </PrimaryButton>
            )}
            {isAdmin && isApproved && (
              <SecondaryButton
                onClick={unapproveUserForm.submitForm}
                color="red"
              >
                <Trans>Unapprove</Trans>
              </SecondaryButton>
            )}
            {!isOwner && isFollowing && (
              <SecondaryButton onClick={toggleFollowForm.submitForm}>
                <Trans>Unfollow</Trans>
              </SecondaryButton>
            )}
            {!isOwner && !isFollowing && (
              <PrimaryButton
                disabled={!isAuthenticated}
                onClick={toggleFollowForm.submitForm}
              >
                <Trans>Follow</Trans>
              </PrimaryButton>
            )}
            {!isOwner && (
              <div
                className={`message ${isAuthenticated ? '' : 'font-disabled'}`}
                onClick={openSendMessage}
              >
                <MailOutlineIcon />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)
