import { Edit, Save } from '@material-ui/icons'
import {
  AddonItem,
  // AddonItem,
  // FloatingMenu,
  InputTextField,
  Modal,
  PrimaryButton,
  RoundButton,
  SecondaryButton,
  useImageUrl,
} from '@moodlenet/component-library'
import type { useFormik } from 'formik'
import { FC, useLayoutEffect, useRef, useState } from 'react'
import { ProfileAccess, ProfileFormValues } from '../../../../../common/types.mjs'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import defaultBackground from '../../../assets/img/default-background.svg'
import './MainProfileCard.scss'

export type MainProfileCardSlots = {
  mainColumnItems?: AddonItem[]
  topItems?: AddonItem[]
  titleItems?: AddonItem[]
  subtitleItems?: AddonItem[]
  footerItems?: AddonItem[]
}

export type MainProfileCardPropsControlled = Omit<
  MainProfileCardProps,
  'isEditing' | 'toggleIsEditing'
>
export type MainProfileCardProps = {
  slots: MainProfileCardSlots
  form: ReturnType<typeof useFormik<ProfileFormValues>>
  access: ProfileAccess
  isEditing?: boolean
  toggleIsEditing(): unknown
}

export const MainProfileCard: FC<MainProfileCardProps> = ({
  slots,
  form,
  access,
  isEditing,
  toggleIsEditing,
}) => {
  const { mainColumnItems, topItems, titleItems, subtitleItems, footerItems } = slots
  const { canEdit } = access
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

  const [backgroundUrl] = useImageUrl(form.values.backgroundImage, defaultBackground)
  const background = {
    backgroundImage: 'url("' + backgroundUrl + '")',
    backgroundSize: 'cover',
  }

  const [avatarUrl] = useImageUrl(form.values.avatarImage, defaultAvatar)
  const avatar = {
    backgroundImage: 'url("' + avatarUrl + '")',
    backgroundSize: 'cover',
  }

  const editButton = canEdit ? (
    <div className="edit-save" key="edit-save">
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
  ) : null

  const title = isEditing ? (
    <InputTextField
      className="display-name underline"
      placeholder={/* t */ `Display name`}
      value={form.values.displayName}
      onChange={form.handleChange}
      name="displayName"
      key="display-name"
      displayMode={true}
      edit={isEditing}
      disabled={form.isSubmitting}
      error={isEditing && shouldShowErrors && form.errors.displayName}
    />
  ) : (
    <div className="display-name" key="display-name">
      {form.values.displayName}
    </div>
  )

  const description = isEditing ? (
    <InputTextField
      textAreaAutoSize
      value={form.values.aboutMe}
      onChange={form.handleChange}
      isTextarea
      displayMode
      placeholder={/* t */ `What should others know about you?`}
      className="description"
      key="description"
      name="aboutMe"
      edit={isEditing}
      disabled={form.isSubmitting}
      error={isEditing && shouldShowErrors && form.errors.aboutMe}
    />
  ) : (
    <div className="description" key="description">
      {form.values.aboutMe}
    </div>
  )

  const updatedTopItems = [editButton, ...(topItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  const topItemsContainer =
    updatedTopItems.length > 0 ? (
      <div className="top-items" key="top-items">
        {updatedTopItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    ) : null

  const updatedTitleItems = [title, ...(titleItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  const location = isEditing ? (
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
    </span>
  ) : (
    <span key="location">{form.values.location}</span>
  )

  const siteUrl = isEditing ? (
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
    </span>
  ) : (
    <a key="site-url" href={form.values.siteUrl} target="_blank" rel="noreferrer">
      {form.values.siteUrl}
    </a>
  )

  const updatedSubtitleItems = [location, siteUrl, ...(subtitleItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  const header = (
    <div className="profile-card-header" key="card-header">
      <div className="title" key="title-row">
        {updatedTitleItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>

      <div className={`subtitle ${isEditing ? 'edit' : ''}`} key="subtitle-row">
        {updatedSubtitleItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
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
  const backgroundContainer = (
    <div className={`background-container`} key="background-container">
      {editBackgroundButton}
      <div
        className={`background`}
        key="background"
        style={{
          ...background,
          pointerEvents: form.isSubmitting || !form.values.backgroundImage ? 'none' : 'inherit',
          cursor: form.isSubmitting || !form.values.backgroundImage ? 'auto' : 'pointer',
        }}
        onClick={() => setIsShowingBackground(true)}
      />
    </div>
  )

  const avatarContainer = (
    <div className={`avatar-container`} key="avatar-container">
      {editAvatarButton}
      <div
        className={`avatar`}
        style={{
          ...avatar,
          pointerEvents: form.isSubmitting || !form.values.avatarImage ? 'auto' : 'inherit',
          cursor: form.isSubmitting || !form.values.avatarImage ? 'auto' : 'pointer',
        }}
        onClick={() => setIsShowingAvatar(true)}
      ></div>
    </div>
  )

  const modals = (
    <>
      {isShowingBackground && backgroundUrl && (
        <Modal
          className="image-modal"
          closeButton={false}
          onClose={() => setIsShowingBackground(false)}
          style={{ maxWidth: '90%', maxHeight: '90%' }}
          key="background-modal"
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
          key="avatar-modal"
        >
          <img src={avatarUrl} alt="Avatar" />
        </Modal>
      )}
    </>
  )
  const updatedFooterItems = [...(footerItems ?? [])].filter(
    (item): item is AddonItem /* | JSX.Element */ => !!item,
  )

  const footer =
    updatedFooterItems.length > 0 ? (
      <div className="footer">
        {updatedFooterItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    ) : null

  const updatedMainColumnItems = [
    backgroundContainer,
    avatarContainer,
    topItemsContainer,
    header,
    description,
    footer,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  return (
    <div className="main-profile-card" key="profile-card">
      {modals}
      <div className="main-column">
        {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    </div>
  )
}
