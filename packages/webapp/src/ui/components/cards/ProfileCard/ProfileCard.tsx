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
  username: string
  avatarUrl: string
  isOwner?: boolean
  isFollowing?: boolean
  isEditing?: boolean
  email: string
  organizationName: string
  location: string
  siteUrl: string
  isAuthenticated: boolean
  formBag: FormikBag<ProfileFormValues>
  toggleIsEditing(): unknown
  toggleFollow(): unknown
}

export const ProfileCard = withCtrl<ProfileCardProps>(
  ({
    avatarUrl,
    username,
    backgroundUrl,
    isOwner,
    isAuthenticated,
    isEditing,
    email,
    isFollowing,
    location,
    toggleFollow,
    toggleIsEditing,
    organizationName,
    siteUrl,
    formBag,
  }) => {
    const [form, formAttrs] = formBag
    const setFieldValue = form.setFieldValue
    const setDisplayNameField = useCallback((_: string) => setFieldValue('displayName', _), [setFieldValue])
    const setDescriptionField = useCallback((_: string) => setFieldValue('description', _), [setFieldValue])

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
                  edit={isEditing}
                  {...formAttrs.displayName}
                  getText={setDisplayNameField}
                />
              ) : (
                <div className="title">{form.values.displayName}</div>
              )}
              {!isEditing && <img className="verified-icon" src={verifiedIcon} alt="Verified" />}
            </div>
            <div className="subtitle">
              <span>@{username}</span>
              <span>·</span>
              <span>{organizationName}</span>
              <span>·</span>
              <span>{location}</span>
              <span>·</span>
              <a href={siteUrl}>{siteUrl}</a>
            </div>
          </div>
          {isOwner ? (
            <InputTextField
              autoUpdate={true}
              textAreaAutoSize={true}
              value={form.values.description}
              textarea={true}
              displayMode={true}
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
              <a href={`mailto:${email}`} target="-_blank" className={`${isAuthenticated ? '' : 'font-disabled'}`}>
                <MailOutlineIcon />
              </a>
            </div>
          )}
        </div>
      </div>
    )
  },
)
