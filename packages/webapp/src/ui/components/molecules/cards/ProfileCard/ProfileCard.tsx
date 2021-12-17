import { Trans } from '@lingui/macro'
import EditIcon from '@material-ui/icons/Edit'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import SaveIcon from '@material-ui/icons/Save'
import React, { useCallback, useState } from 'react'
import { isEmailAddress } from '../../../../../helpers/utilities'
import approvedIcon from '../../../../assets/icons/approved.svg'
import { withCtrl } from '../../../../lib/ctrl'
import { FormikBag } from '../../../../lib/formik'
import defaultAvatar from '../../../../static/img/default-avatar.svg'
import defaultBackgroud from '../../../../static/img/default-background.svg'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
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
  formBag: FormikBag<ProfileFormValues>
  toggleIsEditing(): unknown
  toggleFollow(): unknown
  openSendMessage(): unknown
  avatarUrl: string | null
  backgroundUrl: string | null
  requestApprovalFormBag: FormikBag<{}>
  approveUserFormBag: FormikBag<{}>
  unapproveUserForm: FormikBag<{}>
  showAccountApprovedSuccessAlert?: boolean
}

export const ProfileCard = withCtrl<ProfileCardProps>(
  ({
    avatarUrl,
    backgroundUrl,
    isOwner,
    isAdmin,
    isApproved,
    isElegibleForApproval,
    showAccountApprovedSuccessAlert,
    isWaitingApproval,
    isAuthenticated,
    isEditing,
    isFollowing,
    formBag,
    openSendMessage,
    toggleFollow,
    toggleIsEditing,
    requestApprovalFormBag: [requestApprovalForm],
    approveUserFormBag: [approveUserForm],
    unapproveUserForm: [unapproveUserForm],
  }) => {
    const [form, formAttrs] = formBag
    const [profileCardErrorMessage, setProfileCardErrorMessage] = useState<
      string | null
    >(null)
    const [isShowingAvatar, setIsShowingAvatar] = useState<boolean>(false)
    const [isShowingBackground, setIsShowingBackground] =
      useState<boolean>(false)
    const setFieldValue = form.setFieldValue
    const setDisplayNameField = useCallback(
      (_: string) => setFieldValue('displayName', _),
      [setFieldValue]
    )
    const setDescriptionField = useCallback(
      (_: string) => setFieldValue('description', _),
      [setFieldValue]
    )
    const setLocationField = useCallback(
      (_: string) => setFieldValue('location', _),
      [setFieldValue]
    )
    const setSiteUrlField = useCallback(
      (_: string) => setFieldValue('siteUrl', _),
      [setFieldValue]
    )

    const setDisplayNameFieldCtrl = (displayName: string) => {
      if (isEmailAddress(form.values.displayName)) {
        setProfileCardErrorMessage('Display name cannot be an email')
      } else {
        setDisplayNameField(displayName)
      }
    }

    const selectBackground = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      document.getElementById('upload-background')?.click()
    }

    const selectAvatar = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      document.getElementById('upload-avatar')?.click()
    }

    const uploadBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.currentTarget.files?.item(0)
      selectedFile && uploadImage(selectedFile, 'background')
    }

    const uploadAvatar = (e?: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e?.currentTarget.files?.item(0)
      selectedFile && uploadImage(selectedFile, 'avatar')
    }

    const uploadImage = useCallback(
      (file: File, type: 'background' | 'avatar') => {
        if (file) {
          type === 'background'
            ? setFieldValue('backgroundImage', file)
            : setFieldValue('avatarImage', file)
        }
      },
      [setFieldValue]
    )

    const background = {
      backgroundImage:
        'url(' + (backgroundUrl ? backgroundUrl : defaultBackgroud) + ')',
      backgroundSize: 'cover',
    }

    const avatar = {
      backgroundImage: 'url(' + (avatarUrl ? avatarUrl : defaultAvatar) + ')',
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
              id="upload-background"
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
                id="upload-avatar"
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
                <PrimaryButton
                  color="green"
                  onHoverColor="orange"
                  onClick={toggleIsEditing}
                >
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
                  className="display-name"
                  autoUpdate={true}
                  value={form.values.displayName}
                  displayMode={true}
                  placeholder="Display name"
                  edit={isEditing}
                  {...formAttrs.displayName}
                  getText={setDisplayNameFieldCtrl}
                />
              ) : (
                <div className="title">{form.values.displayName}</div>
              )}
              {!isEditing && isApproved && (
                <div className={`approved-icon`}>
                  <img
                    src={approvedIcon}
                    className={`${
                      showAccountApprovedSuccessAlert
                        ? 'zooom-in-enter-animation'
                        : ''
                    }`}
                    alt="Approved"
                  />
                </div>
              )}
            </div>
            {isOwner && isEditing ? (
              <div className="subtitle">
                <span>
                  @
                  <InputTextField
                    autoUpdate={true}
                    value={form.values.username}
                    displayMode={true}
                    placeholder="Username"
                    edit={false}
                    {...formAttrs.username}
                  />
                </span>
                <span>
                  <InputTextField
                    autoUpdate={true}
                    value={form.values.organizationName}
                    displayMode={true}
                    placeholder="Organization"
                    edit={false}
                    {...formAttrs.organizationName}
                  />
                </span>
                <span>
                  <InputTextField
                    autoUpdate={true}
                    value={form.values.location}
                    displayMode={true}
                    placeholder="Location"
                    edit={isEditing}
                    {...formAttrs.location}
                    getText={setLocationField}
                  />
                </span>
                <span>
                  <InputTextField
                    autoUpdate={true}
                    value={form.values.siteUrl}
                    displayMode={true}
                    placeholder="Website"
                    edit={isEditing}
                    {...formAttrs.siteUrl}
                    getText={setSiteUrlField}
                  />
                </span>
              </div>
            ) : (
              <div className="subtitle">
                {form.values.username !== '' && (
                  <span>@{form.values.username}</span>
                )}
                {form.values.organizationName !== '' && (
                  <span>{form.values.organizationName}</span>
                )}
                {form.values.location !== '' && (
                  <span>{form.values.location}</span>
                )}
                {form.values.siteUrl !== '' && (
                  <a
                    href={form.values.siteUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {form.values.siteUrl}
                  </a>
                )}
              </div>
            )}
            {profileCardErrorMessage && (
              <div className="error">{profileCardErrorMessage}</div>
            )}
          </div>
          {isOwner ? (
            <InputTextField
              autoUpdate={true}
              textAreaAutoSize={true}
              value={form.values.description}
              textarea={true}
              displayMode={true}
              placeholder="What should others know about you?"
              edit={isEditing}
              {...formAttrs.description}
              getText={setDescriptionField}
            />
          ) : (
            <div className="description">{form.values.description}</div>
          )}
          {isOwner && !isApproved && (
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
                <Trans>Pending</Trans>
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
              <SecondaryButton onClick={toggleFollow}>
                <Trans>Unfollow</Trans>
              </SecondaryButton>
            )}
            {!isOwner && !isFollowing && (
              <PrimaryButton disabled={!isAuthenticated} onClick={toggleFollow}>
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
