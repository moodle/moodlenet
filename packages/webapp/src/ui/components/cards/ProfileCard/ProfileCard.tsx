import { Trans } from '@lingui/macro'
import EditIcon from '@material-ui/icons/Edit'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import SaveIcon from '@material-ui/icons/Save'
import { useCallback } from 'react'
import verifiedIcon from '../../../assets/icons/verified.svg'
import { withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import { ProfileFormValues } from '../../../pages/Profile/types'
import InputTextField from '../../atoms/InputTextField/InputTextField'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import './styles.scss'

export type ProfileCardProps = {
  backgroundUrl: string
  avatarUrl: string
  isOwner?: boolean
  isFollowing?: boolean
  isEditing?: boolean
  isAuthenticated: boolean
  formBag: FormikBag<ProfileFormValues>
  toggleIsEditing(): unknown
  toggleFollow(): unknown
  openSendMessage(): unknown
}

export const ProfileCard = withCtrl<ProfileCardProps>(
  ({
    avatarUrl,
    backgroundUrl,
    isOwner,
    isAuthenticated,
    isEditing,
    openSendMessage,
    isFollowing,
    toggleFollow,
    toggleIsEditing,
    formBag,
  }) => {
    const [form, formAttrs] = formBag
    const setFieldValue = form.setFieldValue
    const setDisplayNameField = useCallback((_: string) => setFieldValue('displayName', _), [setFieldValue])
    const setDescriptionField = useCallback((_: string) => setFieldValue('description', _), [setFieldValue])
    const setLocationField = useCallback((_: string) => setFieldValue('location', _), [setFieldValue])
    const setSiteUrlField = useCallback((_: string) => setFieldValue('siteUrl', _), [setFieldValue])

    return (
      <div className="profile-card">
        <img className="background" src={backgroundUrl} alt="Background" />

        <div className="avatar-and-actions">
          <img className="avatar" src={avatarUrl} alt="Avatar" />
          {isOwner && (
            <div className="actions edit-save">
              {isEditing ? (
                <PrimaryButton color="green" onHoverColor="orange" onClick={toggleIsEditing}>
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
                  getText={setDisplayNameField}
                />
              ) : (
                <div className="title">{form.values.displayName}</div>
              )}
              {!isEditing && <img className="verified-icon" src={verifiedIcon} alt="Verified" />}
            </div>
            {isOwner && isEditing ? (
              <div className="subtitle">
                @
                <InputTextField
                  autoUpdate={true}
                  value={form.values.username}
                  displayMode={true}
                  placeholder="Username"
                  edit={false}
                  {...formAttrs.username}
                />
                <InputTextField
                  autoUpdate={true}
                  value={form.values.organizationName}
                  displayMode={true}
                  placeholder="Organization"
                  edit={false}
                  {...formAttrs.organizationName}
                />
                <InputTextField
                  autoUpdate={true}
                  value={form.values.location}
                  displayMode={true}
                  placeholder="Location"
                  edit={isEditing}
                  {...formAttrs.location}
                  getText={setLocationField}
                />
                <InputTextField
                  autoUpdate={true}
                  value={form.values.siteUrl}
                  displayMode={true}
                  placeholder="Website"
                  edit={isEditing}
                  {...formAttrs.siteUrl}
                  getText={setSiteUrlField}
                />
              </div>
            ) : (
              <div className="subtitle">
                <span>@{form.values.username}</span>
                <span>·</span>
                <span>{form.values.organizationName}</span>
                <span>·</span>
                <span>{form.values.location}</span>
                <span>·</span>
                <a href={form.values.siteUrl}>{form.values.siteUrl}</a>
              </div>
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
          {!isOwner && (
            <div className="buttons">
              {isFollowing ? (
                <SecondaryButton onClick={toggleFollow}>
                  <Trans>Unfollow</Trans>
                </SecondaryButton>
              ) : (
                <PrimaryButton disabled={!isAuthenticated} onClick={toggleFollow}>
                  <Trans>Follow</Trans>
                </PrimaryButton>
              )}
              <div className={`${isAuthenticated ? '' : 'font-disabled'}`} onClick={openSendMessage}>
                <MailOutlineIcon />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  },
)
