import { Edit, Save } from '@material-ui/icons'
import {
  // AddonItem,
  // FloatingMenu,
  InputTextField,
  Modal,
  PrimaryButton,
  RoundButton,
  SecondaryButton,
  useImageUrl,
} from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC, useLayoutEffect, useRef, useState } from 'react'
import { ProfileFormValues } from '../../../../server/types.mjs'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import defaultBackground from '../../../assets/img/default-background.svg'
import './ProfileCard.scss'

export type ProfileCardPropsControlled = Omit<ProfileCardProps, 'isEditing' | 'toggleIsEditing'>
export type ProfileCardProps = {
  form: ReturnType<typeof useFormik<ProfileFormValues>>
  isAuthenticated: boolean
  isEditing?: boolean
  isOwner?: boolean
  canEdit?: boolean
  isAdmin?: boolean
  isApproved?: boolean
  isFollowing?: boolean
  toggleIsEditing(): unknown
}

export const ProfileCard: FC<ProfileCardProps> = ({
  form,
  isEditing,
  canEdit,
  toggleIsEditing,
}) => {
  const [isShowingAvatar, setIsShowingAvatar] = useState<boolean>(false)
  const [isShowingBackground, setIsShowingBackground] = useState<boolean>(false)
  const shouldShowErrors = !!form.submitCount
  const [, /* _isShowingSmallCard */ setIsShowingSmallCard] = useState<boolean>(false)

  const setIsShowingSmallCardHelper = () => {
    setIsShowingSmallCard(window.innerWidth < 550 ? true : false)
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', setIsShowingSmallCardHelper)
    return () => {
      window.removeEventListener('resize', setIsShowingSmallCardHelper)
    }
  }, [])

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
    form.setFieldValue('backgroundImage', e.currentTarget.files?.item(0))

  const uploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) =>
    form.setFieldValue('avatarImage', e.currentTarget.files?.item(0))

  const [backgroundUrl] = useImageUrl(/* form.values.backgroundImage */ null, defaultBackground)
  const background = {
    backgroundImage: 'url("' + backgroundUrl + '")',
    backgroundSize: 'cover',
  }

  const [avatarUrl] = useImageUrl(/* form.values.avatarImage */ null, defaultAvatar)
  const avatar = {
    backgroundImage: 'url("' + avatarUrl + '")',
    backgroundSize: 'cover',
  }

  const editButton = (
    <div className="edit-save">
      {isEditing ? (
        <PrimaryButton
          color="green"
          onClick={() => {
            form.submitForm()
            form.isValid && toggleIsEditing()
          }}
          key="save-button"
        >
          <Save />
        </PrimaryButton>
      ) : (
        <SecondaryButton onClick={toggleIsEditing} color="orange" key="edit-button">
          <Edit />
        </SecondaryButton>
      )}
    </div>
  )

  const title = isEditing ? (
    <InputTextField
      className="display-name underline"
      placeholder={/* t */ `Display name`}
      value={form.values.title}
      onChange={form.handleChange}
      name="title"
      key="display-name"
      displayMode={true}
      edit={isEditing}
      disabled={form.isSubmitting}
      error={isEditing && shouldShowErrors && form.errors.title}
    />
  ) : (
    <div className="display-name" key="display-name">
      {form.values.title}
    </div>
  )

  const description = isEditing ? (
    <InputTextField
      textAreaAutoSize
      value={form.values.description}
      onChange={form.handleChange}
      textarea
      displayMode
      placeholder={/* t */ `What should others know about you?`}
      className="description"
      key="description"
      name="description"
      edit={isEditing}
      disabled={form.isSubmitting}
      error={isEditing && shouldShowErrors && form.errors.description}
    />
  ) : (
    <div className="description" key="description">
      {form.values.description}
    </div>
  )

  const updatedTopItems = canEdit && <div className="top-items">{editButton}</div>

  const updatedTitleItems = [title]

  const baseSubtitleItems = isEditing
    ? [
        <span key="edit-location">
          <InputTextField
            className="underline"
            placeholder="Location"
            value={form.values.location}
            onChange={form.handleChange}
            displayMode={true}
            name="location"
            edit={isEditing}
            disabled={form.isSubmitting}
            error={isEditing && shouldShowErrors && form.errors.location}
          />
        </span>,
        <span key="edit-site-url">
          <InputTextField
            className="underline"
            value={form.values.siteUrl}
            onChange={form.handleChange}
            displayMode={true}
            placeholder="Website"
            name="siteUrl"
            edit={isEditing}
            disabled={form.isSubmitting}
            error={isEditing && shouldShowErrors && form.errors.siteUrl}
          />
        </span>,
      ]
    : [
        <span key="location">{form.values.location}</span>,
        <a key="site-url" href={form.values.siteUrl} target="_blank" rel="noreferrer">
          {form.values.siteUrl}
        </a>,
      ]

  const updatedSubtitleItems = [...baseSubtitleItems]

  const cardHeader = (
    <div className="profile-card-header" key="card-header">
      <div className="title">{updatedTitleItems}</div>

      <div className={`subtitle ${isEditing ? 'edit' : ''}`}>{updatedSubtitleItems}</div>
    </div>
  )

  const editAvatarButton = isEditing && [
    <input
      ref={uploadAvatarRef}
      type="file"
      accept=".jpg,.jpeg,.png,.gif"
      onChange={uploadAvatar}
      key="edit-avatar-input"
      hidden
    />,
    <RoundButton
      className="change-avatar-button"
      type="edit"
      abbrTitle={/* t */ `Edit profile picture`}
      onClick={selectAvatar}
      key="edit-avatar-btn"
    />,
  ]

  const editBackgroundButton = isEditing && [
    <input
      ref={uploadBackgroundRef}
      type="file"
      accept=".jpg,.jpeg,.png,.gif"
      onChange={uploadBackground}
      key="edit-background-input"
      hidden
    />,
    <RoundButton
      className="change-background-button"
      type="edit"
      abbrTitle={/* t */ `Edit background`}
      key="edit-background-btn"
      onClick={selectBackground}
    />,
  ]

  const updatedBottomItems = <div className="buttons"></div>

  const updatedContentItems = [updatedTopItems, cardHeader, description, updatedBottomItems]
  return (
    <div className="profile-card" key="profile-card">
      {isShowingBackground && backgroundUrl && (
        <Modal
          className="image-modal"
          closeButton={false}
          onClose={() => setIsShowingBackground(false)}
          style={{ maxWidth: '90%', maxHeight: '90%' }}
          key="image-modal"
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
          key="image-modal"
        >
          <img src={avatarUrl} alt="Avatar" />
        </Modal>
      )}
      <div className={`background-container`}>
        {editBackgroundButton}
        <div
          className={`background`}
          style={{
            ...background,
            pointerEvents: !isEditing || defaultBackground === backgroundUrl ? 'none' : 'inherit',
          }}
          onClick={() => setIsShowingBackground(true)}
        ></div>
      </div>
      <div className={`avatar-container`}>
        {editAvatarButton}
        <div
          className={`avatar`}
          style={{
            ...avatar,
            pointerEvents: !isEditing || defaultAvatar === avatarUrl ? 'none' : 'inherit',
          }}
          onClick={() => setIsShowingAvatar(true)}
        ></div>
      </div>
      <div className="content">{...updatedContentItems}</div>
    </div>
  )
}
