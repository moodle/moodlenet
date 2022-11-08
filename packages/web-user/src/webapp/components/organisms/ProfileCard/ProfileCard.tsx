import { Edit, Flag, Save, Share } from '@material-ui/icons'
import {
  AddonItem,
  FloatingMenu,
  InputTextField,
  Modal,
  PrimaryButton,
  RoundButton,
  SecondaryButton,
  TertiaryButton,
  useImageUrl,
} from '@moodlenet/component-library'
import { sortAddonItems } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { Dispatch, FC, SetStateAction, useLayoutEffect, useRef, useState } from 'react'
import { ReactComponent as ApprovedIcon } from '../../../assets/icons/approved.svg'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import defaultBackgroud from '../../../assets/img/default-background.svg'
import { ProfileFormValues } from '../../../types.mjs'
import './ProfileCard.scss'

export type ProfileCardProps = {
  form: ReturnType<typeof useFormik<ProfileFormValues>>
  userId: string
  profileUrl: string
  isAuthenticated: boolean
  contentItems?: AddonItem[]
  topItems?: AddonItem[]
  titleItems?: AddonItem[]
  subtitleItems?: AddonItem[]
  bottomItems?: AddonItem[]
  isEditing?: boolean
  isOwner?: boolean
  canEdit?: boolean
  isAdmin?: boolean
  isApproved?: boolean
  isFollowing?: boolean
  isElegibleForApproval?: boolean
  isWaitingApproval?: boolean
  showAccountApprovedSuccessAlert?: boolean
  openSendMessage(): unknown
  setShowUserIdCopiedAlert: Dispatch<SetStateAction<boolean>>
  setShowUrlCopiedAlert: Dispatch<SetStateAction<boolean>>
  setIsReporting: Dispatch<SetStateAction<boolean>>
  toggleIsEditing(): unknown
}

export const ProfileCard: FC<ProfileCardProps> = ({
  form,
  topItems,
  titleItems,
  subtitleItems,
  bottomItems,
  contentItems,
  userId,
  profileUrl,
  isEditing,
  isAuthenticated,
  isOwner,
  canEdit,
  isAdmin,
  isApproved,
  isFollowing,
  isElegibleForApproval,
  isWaitingApproval,
  showAccountApprovedSuccessAlert,
  openSendMessage,
  setShowUserIdCopiedAlert,
  setShowUrlCopiedAlert,
  toggleIsEditing,
  setIsReporting,
}) => {
  const [isShowingAvatar, setIsShowingAvatar] = useState<boolean>(false)
  const [isShowingBackground, setIsShowingBackground] = useState<boolean>(false)
  const shouldShowErrors = !!form.submitCount
  const [isShowingSmallCard, setIsShowingSmallCard] = useState<boolean>(false)

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

  const [backgroundUrl] = useImageUrl(form.values.backgroundImage, defaultBackgroud)
  const background = {
    backgroundImage: 'url(' + backgroundUrl + ')',
    backgroundSize: 'cover',
  }

  const [avatarUrl] = useImageUrl(form.values.avatarImage, defaultAvatar)
  const avatar = {
    backgroundImage: 'url(' + avatarUrl + ')',
    backgroundSize: 'cover',
  }

  const editButton = canEdit && (
    <div className="edit-save">
      {isEditing ? (
        <PrimaryButton
          // className={`${form.isSubmitting ? 'loading' : ''}`}
          color="green"
          onClick={toggleIsEditing}
          key="save-button"
        >
          {/* {form.isSubmitting ? (
            <div className="loading">
              <Loading color="white" />
            </div>
          ) : ( */}
          <Save />
          {/* )} */}
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
      textAreaAutoSize={true}
      value={form.values.description}
      onChange={form.handleChange}
      textarea={true}
      displayMode={true}
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

  const approvedIcon = !isEditing && isOwner && isApproved && (
    <abbr className={`approved-icon`} title={/* t */ `Approved`} key="approved-icon">
      <ApprovedIcon
        className={`${showAccountApprovedSuccessAlert ? 'zooom-in-enter-animation' : ''}`}
      />
    </abbr>
  )

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

  const copyIdButton = !isEditing && isOwner && (
    <abbr
      className={`user-id`}
      title={/* t */ `Click to copy your ID to the clipboard`}
      key="user-id"
    >
      <TertiaryButton className="copy-id" onClick={copyId}>
        Copy ID
      </TertiaryButton>
    </abbr>
  )

  const sortedTopItems = sortAddonItems([editButton, ...(topItems ?? [])])

  const updatedTopItems = sortedTopItems.length > 0 && (
    <div className="top-items" key="tops-items">
      {sortedTopItems}
    </div>
  )
  const updatedTitleItems = sortAddonItems([
    title,
    approvedIcon,
    copyIdButton,
    ...(titleItems ?? []),
  ])

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
  const updatedSubtitleItems = sortAddonItems([...baseSubtitleItems, ...(subtitleItems ?? [])])

  const cardHeader = (
    <div className="profile-card-header" key="card-header">
      <div className="title">{updatedTitleItems}</div>

      <div className={`subtitle ${isEditing ? 'edit' : ''}`}>{updatedSubtitleItems}</div>
    </div>
  )

  const approvalInfo = isOwner && !isApproved && !isWaitingApproval && (
    <div className="not-approved-warning" key="approva-info">
      {
        isElegibleForApproval
          ? // <Trans>
            `We need to approve your account to make your content public.
          Press the button below for account approval.`
          : // </Trans>
            // <Trans>
            ` We need to approve your account to make your content public.
          Upload 5 good-quality resources and click the button below for
          account approval.`
        // </Trans>
      }
    </div>
  )

  const bottomButtons = [
    isOwner && !isApproved /* && !isWaitingApproval */ && (
      <PrimaryButton
        disabled={!isElegibleForApproval}
        key="request-approval-btn"
        // onClick={requestApprovalForm.submitForm}
      >
        {/* <Trans> */}
        Request approval
        {/* </Trans> */}
      </PrimaryButton>
    ),
    isOwner && isWaitingApproval && (
      <SecondaryButton disabled={true} key="waiting-for-approval-btn">
        {/* <Trans> */}
        Waiting for approval
        {/* </Trans> */}
      </SecondaryButton>
    ),
    isAdmin && !isApproved && (
      <PrimaryButton /* onClick={approveUserForm.submitForm} */ color="green" key="approve-btn">
        {/* <Trans> */}
        Approve
        {/* </Trans> */}
      </PrimaryButton>
    ),
    isAdmin && isApproved && (
      <SecondaryButton
        // onClick={unapproveUserForm.submitForm}
        color="red"
        key="unapprove-btn"
      >
        {/* <Trans> */}
        Unapprove
        {/* </Trans> */}
      </SecondaryButton>
    ),
    !isOwner && !isFollowing && (
      <PrimaryButton
        disabled={!isAuthenticated}
        // onClick={toggleFollowForm.submitForm}
        className="following-button"
        key="follow-btn"
      >
        {/* <Trans> */}
        Follow
        {/* </Trans> */}
      </PrimaryButton>
    ),
    !isOwner && isFollowing && (
      <SecondaryButton
        disabled={!isAuthenticated}
        // onClick={toggleFollowForm.submitForm}
        className="following-button"
        color="orange"
        key="following-btn"
      >
        {/* <Trans> */}
        Following
        {/* </Trans> */}
      </SecondaryButton>
    ),
    !isOwner && (
      <SecondaryButton
        color="grey"
        className={`message`}
        disabled={!isAuthenticated}
        onClick={openSendMessage}
        key="message-btn"
      >
        {/* <Trans> */}
        Message
        {/* </Trans> */}
      </SecondaryButton>
    ),
    isAuthenticated && !isOwner && (
      <FloatingMenu
        menuContent={[
          <div tabIndex={0} onClick={copyUrl} key="share">
            <Share />
            {/* <Trans> */}
            Share
            {/* </Trans> */}
          </div>,
          <div tabIndex={0} onClick={() => setIsReporting(true)} key="report">
            <Flag />
            {/* <Trans> */}
            Report
            {/* </Trans> */}
          </div>,
        ]}
        hoverElement={
          isShowingSmallCard ? (
            <SecondaryButton color="grey" className={`more small`}>
              <div className="three-dots">...</div>
            </SecondaryButton>
          ) : (
            <SecondaryButton color="grey" className={`more big`}>
              <div className="text">More</div>
            </SecondaryButton>
          )
        }
        key="more-btn"
      />
    ),
  ]

  const editAvatarButton = isEditing && (
    <>
      <input
        ref={uploadAvatarRef}
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        onChange={uploadAvatar}
        hidden
      />
      <RoundButton
        className="change-avatar-button"
        type="edit"
        abbrTitle={/* t */ `Edit profile picture`}
        onClick={selectAvatar}
      />
    </>
  )

  const editBackgroundButton = isEditing && (
    <>
      <input
        ref={uploadBackgroundRef}
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        onChange={uploadBackground}
        hidden
      />
      <RoundButton
        className="change-background-button"
        type="edit"
        abbrTitle={/* t */ `Edit background`}
        onClick={selectBackground}
      />
    </>
  )

  const updatedBottomItems = (
    <div className="buttons" key="buttons">
      {sortAddonItems([...bottomButtons, ...(bottomItems ?? [])])}
    </div>
  )

  const updatedContentItems = sortAddonItems([
    updatedTopItems,
    cardHeader,
    description,
    approvalInfo,
    updatedBottomItems,
    ...(contentItems ?? []),
  ])

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
      <div
        className="background"
        style={{
          ...background,
          // pointerEvents: form.isSubmitting ? 'none' : 'inherit',
        }}
        onClick={() => !isEditing && setIsShowingBackground(true)}
      >
        {editBackgroundButton}
      </div>
      <div
        className="avatar"
        style={{
          ...avatar,
          // pointerEvents: form.isSubmitting ? 'none' : 'inherit',
        }}
        onClick={() => !isEditing && setIsShowingAvatar(true)}
      >
        {editAvatarButton}
      </div>
      <div className="content">{updatedContentItems}</div>
    </div>
  )
}
