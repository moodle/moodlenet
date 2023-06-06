import { Edit, Save } from '@material-ui/icons'
import type { AddonItem } from '@moodlenet/component-library'
import {
  FloatingMenu,
  InputTextField,
  Modal,
  PrimaryButton,
  RoundButton,
  SecondaryButton,
  Snackbar,
  TertiaryButton,
  useImageUrl,
} from '@moodlenet/component-library'
import { useFormik } from 'formik'

import { Share } from '@mui/icons-material'
import type { FC } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { messageFormValidationSchema } from '../../../../../common/exports.mjs'
import type {
  ProfileAccess,
  ProfileActions,
  ProfileData,
  ProfileFormValues,
  ProfileState,
} from '../../../../../common/types.mjs'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import { FollowButton } from '../../atoms/FollowButton/FollowButton.js'
import './MainProfileCard.scss'

export type MainProfileCardSlots = {
  mainColumnItems: AddonItem[]
  topItems: AddonItem[]
  titleItems: AddonItem[]
  subtitleItems: AddonItem[]
  footerItems: AddonItem[]
}

export type MainProfileCardPropsControlled = Omit<
  MainProfileCardProps,
  'isEditing' | 'toggleIsEditing'
>
export type MainProfileCardProps = {
  slots: MainProfileCardSlots
  data: ProfileData
  form: ReturnType<typeof useFormik<ProfileFormValues>>
  access: ProfileAccess
  isEditing: boolean
  state: ProfileState
  actions: ProfileActions
  profileUrl: string
  toggleIsEditing(): unknown
}

export const MainProfileCard: FC<MainProfileCardProps> = ({
  slots,
  form,
  data,
  access,
  state,
  actions,
  isEditing,
  profileUrl,
  toggleIsEditing,
}) => {
  const { mainColumnItems, topItems, titleItems, subtitleItems, footerItems } = slots
  const { avatarUrl, backgroundUrl, userId } = data
  const { canEdit, isCreator, isAuthenticated, canFollow } = access
  const { followed } = state
  const { toggleFollow, sendMessage, setAvatar, setBackground } = actions

  const [updatedAvatar, setUpdatedAvatar] = useState<string | undefined | null>(avatarUrl)
  const [updatedBackground, setUpdatedBackground] = useState<string | undefined | null>(
    backgroundUrl,
  )

  const [isShowingAvatar, setIsShowingAvatar] = useState<boolean>(false)
  const [isShowingBackground, setIsShowingBackground] = useState<boolean>(false)
  const shouldShowErrors = !!form.submitCount
  const [shouldShowMessageErrors, setShouldShowMessageErrors] = useState<boolean>(false)
  const [isShowingSmallCard, setIsShowingSmallCard] = useState<boolean>(false)
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false)
  const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  const [showUserIdCopiedAlert, setShowUserIdCopiedAlert] = useState<boolean>(false)
  const [showMessageSentAlert, setShowMessageSentAlert] = useState<boolean>(false)

  const avatarForm = useFormik<{ image: File | string | null | undefined }>({
    initialValues: { image: avatarUrl },
    // validationSchema: validationSchema,
    onSubmit: values => {
      return typeof values.image !== 'string' ? setAvatar(values.image) : undefined
    },
  })

  const [avatarImageUrl] = useImageUrl(avatarUrl, defaultAvatar)
  const [avatarFromForm] = useImageUrl(avatarForm.values.image)

  useEffect(() => {
    setUpdatedAvatar(avatarUrl)
  }, [avatarUrl])

  useEffect(() => {
    setUpdatedAvatar(avatarFromForm)
  }, [avatarFromForm])

  const backgroundForm = useFormik<{ image: File | string | null | undefined }>({
    initialValues: { image: backgroundUrl },
    // validationSchema: validationSchema,
    onSubmit: values => {
      return typeof values.image !== 'string' ? setBackground(values.image) : undefined
    },
  })

  const [backgroundImageUrl] = useImageUrl(backgroundUrl, defaultAvatar)
  const [backgroundFromForm] = useImageUrl(backgroundForm.values.image)

  useEffect(() => {
    setUpdatedBackground(backgroundUrl)
  }, [backgroundUrl])

  useEffect(() => {
    setUpdatedBackground(backgroundFromForm)
  }, [backgroundFromForm])

  const messageForm = useFormik<{ msg: string }>({
    initialValues: { msg: '' },
    validationSchema: messageFormValidationSchema,
    onSubmit: (values, { resetForm }) => {
      resetForm()
      return sendMessage(values.msg)
    },
  })

  const checkAndSendMessage = () => {
    if (messageForm.isValid) {
      sendMessage(messageForm.values.msg)
      setShouldShowMessageErrors(false)
      setIsSendingMessage(false)
      setShowMessageSentAlert(true)
    } else {
      setShouldShowMessageErrors(true)
    }
  }

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
    backgroundForm.setFieldValue('image', e.currentTarget.files?.item(0))

  const uploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) =>
    avatarForm.setFieldValue('image', e.currentTarget.files?.item(0))

  const background = {
    backgroundImage: 'url("' + updatedBackground + '")',
    backgroundSize: 'cover',
  }

  const avatar = {
    backgroundImage: 'url("' + updatedAvatar + '")',
    backgroundSize: 'cover',
  }

  const copyId = () => {
    navigator.clipboard.writeText(userId)
    setShowUserIdCopiedAlert(false)
    setTimeout(() => {
      setShowUserIdCopiedAlert(true)
    }, 100)
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(profileUrl)
    setShowUrlCopiedAlert(false)
    setTimeout(() => {
      setShowUrlCopiedAlert(true)
    }, 100)
  }

  const editButton = canEdit ? (
    <div className="edit-save" key="edit-save">
      {isEditing ? (
        <PrimaryButton
          color="green"
          onClick={() => {
            form.submitForm()
            avatarForm.submitForm()
            backgroundForm.submitForm()
            form.isValid && avatarForm.isValid && backgroundForm.isValid && toggleIsEditing()
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
      placeholder={`Display name`}
      value={form.values.displayName}
      onChange={form.handleChange}
      name="displayName"
      key="display-name"
      noBorder={true}
      edit={isEditing}
      error={isEditing && shouldShowErrors && form.errors.displayName}
    />
  ) : (
    <div className="display-name" key="display-name">
      {form.values.displayName}
    </div>
  )

  const copyIdButton = !isEditing && isCreator && (
    <abbr className={`user-id`} title={`Click to copy your ID to the clipboard`}>
      <TertiaryButton className="copy-id" onClick={copyId}>
        Copy ID
      </TertiaryButton>
    </abbr>
  )

  const description = isEditing ? (
    <InputTextField
      textAreaAutoSize
      value={form.values.aboutMe}
      onChange={form.handleChange}
      isTextarea
      noBorder={true}
      placeholder={`What should others know about you?`}
      className="description"
      key="description"
      name="aboutMe"
      edit={isEditing}
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

  const updatedTitleItems = [title, copyIdButton, ...(titleItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  const location = isEditing ? (
    <span key="edit-location">
      <InputTextField
        className="underline"
        placeholder="Location"
        value={form.values.location}
        onChange={form.handleChange}
        noBorder
        name="location"
        edit={isEditing}
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
        noBorder
        placeholder="Website"
        name="siteUrl"
        edit={isEditing}
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
      abbrTitle={`Edit profile picture`}
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
      abbrTitle={`Edit background`}
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
          pointerEvents:
            backgroundForm.isSubmitting || !backgroundForm.values.image ? 'none' : 'inherit',
          cursor: backgroundForm.isSubmitting || !backgroundForm.values.image ? 'auto' : 'pointer',
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
          pointerEvents: avatarForm.isSubmitting || !avatarForm.values.image ? 'auto' : 'inherit',
          cursor: avatarForm.isSubmitting || !avatarForm.values.image ? 'auto' : 'pointer',
        }}
        onClick={() => setIsShowingAvatar(true)}
      ></div>
    </div>
  )

  const modals = (
    <>
      {isShowingBackground && backgroundImageUrl && (
        <Modal
          className="image-modal"
          closeButton={false}
          onClose={() => setIsShowingBackground(false)}
          style={{ maxWidth: '90%', maxHeight: '90%' }}
          key="background-modal"
        >
          <img src={backgroundImageUrl} alt="Background" />
        </Modal>
      )}
      {isShowingAvatar && avatarImageUrl && (
        <Modal
          className="image-modal"
          closeButton={false}
          onClose={() => setIsShowingAvatar(false)}
          style={{ maxWidth: '90%', maxHeight: '90%' }}
          key="avatar-modal"
        >
          <img src={avatarImageUrl} alt="Avatar" />
        </Modal>
      )}
      {isSendingMessage && (
        <Modal
          title={`${`Send a message to`} ${form.values.displayName}`}
          actions={<PrimaryButton onClick={checkAndSendMessage}>Send</PrimaryButton>}
          onClose={() => {
            setIsSendingMessage(false)
            setShouldShowMessageErrors(false)
          }}
          style={{ maxWidth: '400px' }}
        >
          <InputTextField
            isTextarea={true}
            name="msg"
            onChange={messageForm.handleChange}
            error={shouldShowMessageErrors && messageForm.errors.msg}
          />
        </Modal>
      )}
    </>
  )

  const snackbars = [
    showUserIdCopiedAlert && (
      <Snackbar type="success" position="bottom" autoHideDuration={6000} showCloseButton={false}>
        User ID copied to the clipboard, use it to connect with Moodle LMS
      </Snackbar>
    ),
    showUrlCopiedAlert && (
      <Snackbar type="success" position="bottom" autoHideDuration={6000} showCloseButton={false}>
        Copied to clipoard
      </Snackbar>
    ),
    showMessageSentAlert && (
      <Snackbar type="success" position="bottom" autoHideDuration={6000} showCloseButton={false}>
        Message sent
      </Snackbar>
    ),
  ]

  const footerButtons = [
    // isCreator && !isApproved && !isWaitingApproval && (
    //   <PrimaryButton
    //     disabled={!isElegibleForApproval}
    //     onClick={requestApprovalForm.submitForm}
    //   >
    //     Request approval
    //   </PrimaryButton>
    // ),
    // isCreator && isWaitingApproval && (
    //   <SecondaryButton disabled={true}>
    //     Waiting for approval
    //   </SecondaryButton>
    // ),
    // isAdmin && !isApproved && (
    //   <PrimaryButton onClick={approveUserForm.submitForm} color="green">
    //     Approve
    //   </PrimaryButton>
    // ),
    // isAdmin && isApproved && (
    //   <SecondaryButton
    //     onClick={unapproveUserForm.submitForm}
    //     color="red"
    //   >
    //     Unapprove
    //   </SecondaryButton>
    // ),
    // !isCreator && !isFollowing && (
    //   <PrimaryButton
    //     disabled={!isAuthenticated}
    //     onClick={toggleFollowForm.submitForm}
    //     className="following-button"
    //   >
    //     {/* <AddIcon /> */}
    //     Follow
    //   </PrimaryButton>
    // ),
    // !isCreator && isFollowing && (
    //   <SecondaryButton
    //     disabled={!isAuthenticated}
    //     onClick={toggleFollowForm.submitForm}
    //     className="following-button"
    //     color="orange"
    //   >
    //     {/* <CheckIcon /> */}
    //     Following
    //   </SecondaryButton>
    // ),
    !isCreator && (
      <FollowButton
        canFollow={canFollow}
        followed={followed}
        isAuthenticated={isAuthenticated}
        isCreator={isCreator}
        toggleFollow={toggleFollow}
        key="follow-button"
      />
    ),
    !isCreator && (
      <SecondaryButton
        color="grey"
        className={`message`}
        disabled={!isAuthenticated}
        onClick={() => setIsSendingMessage(true)}
        abbr={!isAuthenticated ? 'Login or signup to send messages' : 'Send a message'}
      >
        Message
      </SecondaryButton>
      // <TertiaryButton
      //   className={`message ${isAuthenticated ? '' : 'font-disabled'}`}
      //   onClick={openSendMessage}
      // >
      //   <MailOutlineIcon />
      // </TertiaryButton>
    ),

    <FloatingMenu
      key="more-button-menu"
      menuContent={[
        {
          Element: (
            <div key="share-button" tabIndex={0} onClick={copyUrl}>
              <Share />
              Share
            </div>
          ),
        },

        // !isCreator && <div tabIndex={0} onClick={() => setIsReporting(true)}>
        //   <FlagIcon />
        //   Report
        // </div>,
      ]}
      hoverElement={
        isShowingSmallCard ? (
          <SecondaryButton color="grey" className={`more small`} abbr="More actions">
            <div className="three-dots">...</div>
          </SecondaryButton>
        ) : (
          <SecondaryButton color="grey" className={`more big`} abbr="More actions">
            <div className="text">More</div>
          </SecondaryButton>
        )
      }
    />,
  ]

  const updatedFooterItems = [...footerButtons, ...(footerItems ?? [])].filter(
    (item): item is AddonItem /* | JSX.Element */ => !!item,
  )

  const footer =
    updatedFooterItems.length > 0 ? (
      <div className="main-profile-card-footer">
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
      {snackbars}
      <div className="main-column">
        {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    </div>
  )
}
