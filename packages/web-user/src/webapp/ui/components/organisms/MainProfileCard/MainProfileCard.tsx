import type { AddonItem } from '@moodlenet/component-library'
import {
  FloatingMenu,
  InputTextField,
  Modal,
  PrimaryButton,
  RoundButton,
  SecondaryButton,
  Snackbar,
  SnackbarStack,
  useImageUrl,
} from '@moodlenet/component-library'
import { Edit, Save } from '@mui/icons-material'
import { useFormik } from 'formik'

import { Share } from '@mui/icons-material'
import type { FC } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type {
  ProfileAccess,
  ProfileActions,
  ProfileData,
  ProfileFormValues,
  ProfileState,
} from '../../../../../common/types.mjs'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
// import {
//   ApprovalBadge,
//   ApprovalButton,
//   ApprovalInfo,
// } from '../../atoms/ApproveButton/ApproveButton.js'
import type { ValidationSchemas } from '../../../../../common/validationSchema.mjs'
import { ApprovalButton } from '../../atoms/ApproveButton/ApproveButton.js'
import { FollowButton } from '../../atoms/FollowButton/FollowButton.js'
import './MainProfileCard.scss'

export type MainProfileCardSlots = {
  mainColumnItems: (AddonItem | null)[]
  topItems: (AddonItem | null)[]
  titleItems: (AddonItem | null)[]
  subtitleItems: (AddonItem | null)[]
  footerItems: (AddonItem | null)[]
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
  validationSchemas: ValidationSchemas
}

export const MainProfileCard: FC<MainProfileCardProps> = ({
  slots,
  form,
  data,
  access,
  state,
  actions,
  isEditing,
  validationSchemas,
  profileUrl,
  toggleIsEditing,
}) => {
  const { mainColumnItems, topItems, titleItems, subtitleItems, footerItems } = slots
  const { avatarUrl, backgroundUrl } = data
  const {
    canEdit,
    isCreator,
    isAuthenticated,
    canFollow,
    // canApprove
  } = access
  const {
    followed,
    // isPublisher,
    // isElegibleForApproval,
    // isWaitingApproval,
    // showAccountApprovedSuccessAlert,
  } = state
  const {
    toggleFollow,
    sendMessage,
    setAvatar,
    setBackground,
    // approveUser,
    // requestApproval,
    // unapproveUser,
  } = actions

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
  const [showMessageSentAlert, setShowMessageSentAlert] = useState<boolean>(false)

  const avatarForm = useFormik<{ image: File | string | null | undefined }>({
    initialValues: { image: avatarUrl },
    validationSchema: validationSchemas.avatarImageValidation,
    onSubmit: values => {
      return typeof values.image !== 'string' ? setAvatar(values.image) : undefined
    },
  })

  const [avatarImageUrl] = useImageUrl(avatarUrl, defaultAvatar)
  const [avatarFromForm] = useImageUrl(avatarForm.values.image)

  useEffect(() => {
    const avatarToChange =
      avatarForm.isValid && avatarFromForm ? avatarFromForm : avatarImageUrl ?? null
    avatarToChange && setUpdatedAvatar(avatarToChange)
  }, [avatarForm.isValid, avatarFromForm, avatarImageUrl, avatarUrl])

  const backgroundForm = useFormik<{ image: File | string | null | undefined }>({
    initialValues: { image: backgroundUrl },
    validationSchema: validationSchemas.backgroundImageValidation,
    onSubmit: values => {
      return typeof values.image !== 'string' ? setBackground(values.image) : undefined
    },
  })

  const [backgroundImageUrl] = useImageUrl(backgroundUrl, defaultAvatar)
  const [backgroundFromForm] = useImageUrl(backgroundForm.values.image)

  useEffect(() => {
    const backgroundToChange =
      backgroundForm.isValid && backgroundFromForm ? backgroundFromForm : backgroundImageUrl ?? null
    backgroundToChange && setUpdatedBackground(backgroundToChange)
  }, [backgroundForm.isValid, backgroundFromForm, backgroundImageUrl])

  const messageForm = useFormik<{ msg: string }>({
    initialValues: { msg: '' },
    validationSchema: validationSchemas.messageFormValidationSchema,
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
            avatarForm.isValid && avatarForm.submitForm()
            backgroundForm.isValid && backgroundForm.submitForm()
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

  const description = isEditing ? (
    <InputTextField
      className="description"
      key="description"
      name="aboutMe"
      onChange={form.handleChange}
      isTextarea
      textAreaAutoSize
      noBorder
      edit={isEditing}
      placeholder={`What should others know about you?`}
      value={form.values.aboutMe}
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

  // const approvedBadge = (
  //   <ApprovalBadge
  //     canEdit={canEdit}
  //     isPublisher={isPublisher}
  //     isEditing={isEditing}
  //     showAccountApprovedSuccessAlert={showAccountApprovedSuccessAlert}
  //   />
  // )

  const updatedTitleItems = [
    title,
    // approvedBadge,
    ...(titleItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const location = isEditing ? (
    <span key="edit-location">
      <InputTextField
        className="underline"
        placeholder="Location"
        value={form.values.location ?? undefined}
        onChange={form.handleChange}
        noBorder
        name="location"
        edit={isEditing}
        error={isEditing && shouldShowErrors && form.errors.location}
      />
    </span>
  ) : (
    form.values.location &&
    form.values.location !== '' && <span key="location">{form.values.location}</span>
  )

  const siteUrl = isEditing ? (
    <span key="edit-site-url">
      <InputTextField
        className="underline"
        value={form.values.siteUrl ?? undefined}
        onChange={form.handleChange}
        noBorder
        placeholder="Website"
        name="siteUrl"
        edit={isEditing}
        error={isEditing && shouldShowErrors && form.errors.siteUrl}
      />
    </span>
  ) : (
    form.values.siteUrl &&
    form.values.siteUrl !== '' && (
      <a key="site-url" href={form.values.siteUrl} target="_blank" rel="noreferrer">
        {form.values.siteUrl}
      </a>
    )
  )

  const updatedSubtitleItems = [location, siteUrl, ...(subtitleItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  const header = (
    <div className="profile-card-header" key="card-header">
      <div className="title" key="title-row">
        {updatedTitleItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>

      {updatedSubtitleItems.length > 0 && (
        <div className={`subtitle ${isEditing ? 'edit' : ''}`} key="subtitle-row">
          {updatedSubtitleItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
        </div>
      )}
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
          backgroundImage: 'url("' + updatedBackground + '")',
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
          backgroundImage: 'url("' + updatedAvatar + '")',
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

  const snackbars = (
    <SnackbarStack
      snackbarList={[
        showUrlCopiedAlert ? (
          <Snackbar
            type="success"
            position="bottom"
            autoHideDuration={3000}
            showCloseButton={false}
          >
            Copied to clipoard
          </Snackbar>
        ) : null,
        showMessageSentAlert ? (
          <Snackbar
            type="success"
            position="bottom"
            autoHideDuration={3000}
            showCloseButton={false}
          >
            Message sent
          </Snackbar>
        ) : null,
        avatarForm.errors.image ? (
          <Snackbar type="error" position="bottom" autoHideDuration={3000} showCloseButton={false}>
            {avatarForm.errors.image}
          </Snackbar>
        ) : null,
        backgroundForm.errors.image ? (
          <Snackbar type="error" position="bottom" autoHideDuration={3000} showCloseButton={false}>
            {backgroundForm.errors.image}
          </Snackbar>
        ) : null,
      ]}
    />
  )

  const followButton = !isCreator && (
    <FollowButton
      canFollow={canFollow}
      followed={followed}
      isAuthenticated={isAuthenticated}
      isCreator={isCreator}
      toggleFollow={toggleFollow}
      key="follow-button"
    />
  )

  const sendMessageButton = !isCreator && (
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
  )

  const moreButton = !isCreator ? (
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
    />
  ) : null

  const approvalButton = (
    <ApprovalButton access={access} state={state} actions={actions} key={'approval-button'} />
  )

  const updatedFooterItems = [
    followButton,
    approvalButton,
    sendMessageButton,
    ...(footerItems ?? []),
    moreButton,
  ].filter((item): item is AddonItem /* | JSX.Element */ => !!item)

  const footer =
    updatedFooterItems.length > 0 ? (
      <div className="main-profile-card-footer">
        {updatedFooterItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    ) : null

  // const approvalInfo = (
  //   <ApprovalInfo
  //     isPublisher={isPublisher}
  //     isWaitingApproval={isWaitingApproval}
  //     isCreator={isCreator}
  //     isElegibleForApproval={isElegibleForApproval}
  //   />
  // )

  const updatedMainColumnItems = [
    backgroundContainer,
    avatarContainer,
    topItemsContainer,
    header,
    description,
    // approvalInfo,
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
