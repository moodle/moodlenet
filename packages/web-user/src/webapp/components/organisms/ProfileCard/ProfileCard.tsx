import { Edit, Save } from '@material-ui/icons'
import {
  AddonItem,
  FloatingMenu,
  InputTextField,
  Modal,
  PrimaryButton,
  RoundButton,
  SecondaryButton,
  useImageUrl,
} from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC, useLayoutEffect, useRef, useState } from 'react'
import { ProfileFormValues } from '../../../../types.mjs'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import defaultBackgroud from '../../../assets/img/default-background.svg'
import './ProfileCard.scss'

export type ProfileCardPropsControlled = Omit<ProfileCardProps, 'isEditing' | 'toggleIsEditing'>
export type ProfileCardProps = {
  form: ReturnType<typeof useFormik<ProfileFormValues>>
  // userId: string
  // profileUrl: string
  isAuthenticated: boolean
  contentItems?: AddonItem[]
  topItems?: AddonItem[]
  titleItems?: AddonItem[]
  subtitleItems?: AddonItem[]
  bottomItems?: AddonItem[]
  moreButtonItems?: AddonItem[]
  isEditing?: boolean
  isOwner?: boolean
  canEdit?: boolean
  isAdmin?: boolean
  isApproved?: boolean
  isFollowing?: boolean
  // isElegibleForApproval?: boolean
  // isWaitingApproval?: boolean
  // showAccountApprovedSuccessAlert?: boolean
  // openSendMessage(): unknown
  // setShowUserIdCopiedAlert: Dispatch<SetStateAction<boolean>>
  // setShowUrlCopiedAlert: Dispatch<SetStateAction<boolean>>
  // setIsReporting: Dispatch<SetStateAction<boolean>>
  toggleIsEditing(): unknown
}

export const ProfileCard: FC<ProfileCardProps> = ({
  form,
  topItems,
  titleItems,
  subtitleItems,
  bottomItems,
  contentItems,
  moreButtonItems,
  // userId,
  // profileUrl,
  isEditing,
  isAuthenticated,
  isOwner,
  canEdit,
  // isAdmin,
  // isApproved,
  // isFollowing,
  // isElegibleForApproval,
  // isWaitingApproval,
  // showAccountApprovedSuccessAlert,
  // openSendMessage,
  // setShowUserIdCopiedAlert,
  // setShowUrlCopiedAlert,
  toggleIsEditing,
  // setIsReporting,
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

  const [backgroundUrl] = useImageUrl(/* form.values.backgroundImage */ null, defaultBackgroud)
  const background = {
    backgroundImage: 'url("' + backgroundUrl + '")',
    backgroundSize: 'cover',
  }

  const [avatarUrl] = useImageUrl(/* form.values.avatarImage */ null, defaultAvatar)
  const avatar = {
    backgroundImage: 'url("' + avatarUrl + '")',
    backgroundSize: 'cover',
  }

  const editButton = canEdit
    ? {
        Item: () => (
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
        ),
        key: 'edit-buttons',
      }
    : undefined

  const title = {
    Item: () =>
      isEditing ? (
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
      ),
    key: 'title',
  }

  const description = isEditing
    ? {
        Item: () => (
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
        ),
        key: 'description',
      }
    : {
        Item: () => (
          <div className="description" key="description">
            {form.values.description}
          </div>
        ),
        key: 'description',
      }

  // const approvedIcon = !isEditing && isOwner && isApproved && (
  //   <abbr className={`approved-icon`} title={/* t */ `Approved`} key="approved-icon">
  //     <ApprovedIcon
  //       className={`${showAccountApprovedSuccessAlert ? 'zooom-in-enter-animation' : ''}`}
  //     />
  //   </abbr>
  // )

  // const copyId = () => {
  //   navigator.clipboard.writeText(userId)
  //   setShowUserIdCopiedAlert(false)
  //   setTimeout(() => {
  //     setShowUserIdCopiedAlert(true)
  //   }, 100)
  // }

  // const copyUrl = () => {
  //   navigator.clipboard.writeText(profileUrl)
  //   setShowUrlCopiedAlert(false)
  //   setTimeout(() => {
  //     setShowUrlCopiedAlert(true)
  //   }, 100)
  // }

  // const copyIdButton = !isEditing && isOwner && (
  //   <abbr
  //     className={`user-id`}
  //     title={/* t */ `Click to copy your ID to the clipboard`}
  //     key="user-id"
  //   >
  //     <TertiaryButton className="copy-id" onClick={copyId}>
  //       Copy ID
  //     </TertiaryButton>
  //   </abbr>
  // )

  const allTopItems: (AddonItem | undefined)[] = [editButton, ...(topItems ?? [])].filter(Boolean)
  const updatedTopItems =
    allTopItems.length > 0
      ? {
          Item: () => (
            <div className="top-items">{allTopItems.map(i => i && <i.Item key={i.key} />)}</div>
          ),
          key: 'top-items',
        }
      : undefined

  const updatedTitleItems = [
    title,
    // approvedIcon,
    // copyIdButton,
    ...(titleItems ?? []),
  ].filter(Boolean)

  const baseSubtitleItems = isEditing
    ? [
        {
          Item: () => (
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
          ),
          key: 'edit-location',
        },
        {
          Item: () => (
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
          ),
          key: 'edit-site-url',
        },
      ]
    : [
        { Item: () => <span key="location">{form.values.location}</span>, key: 'location' },
        {
          Item: () => (
            <a key="site-url" href={form.values.siteUrl} target="_blank" rel="noreferrer">
              {form.values.siteUrl}
            </a>
          ),
          location: 'site-url',
        },
      ]
  const updatedSubtitleItems = [...baseSubtitleItems, ...(subtitleItems ?? [])].filter(Boolean)

  const cardHeader = {
    Item: () => (
      <div className="profile-card-header" key="card-header">
        <div className="title">{updatedTitleItems.map(i => i && <i.Item key={i.key} />)}</div>

        <div className={`subtitle ${isEditing ? 'edit' : ''}`}>
          {updatedSubtitleItems.map(i => i && <i.Item key={i.key} />)}
        </div>
      </div>
    ),
    key: 'profile-card-header',
  }

  // const approvalInfo = isOwner && !isApproved && !isWaitingApproval && (
  //   <div className="not-approved-warning" key="approva-info">
  //     {
  //       isElegibleForApproval
  //         ? // <Trans>
  //           `We need to approve your account to make your content public.
  //         Press the button below for account approval.`
  //         : // </Trans>
  //           // <Trans>
  //           ` We need to approve your account to make your content public.
  //         Upload 5 good-quality resources and click the button below for
  //         account approval.`
  //       // </Trans>
  //     }
  //   </div>
  // )

  const bottomButtons = [
    //   isOwner && !isApproved /* && !isWaitingApproval */ && (
    //     <PrimaryButton
    //       disabled={!isElegibleForApproval}
    //       key="request-approval-btn"
    //       // onClick={requestApprovalForm.submitForm}
    //     >
    //       {/* <Trans> */}
    //       Request approval
    //       {/* </Trans> */}
    //     </PrimaryButton>
    //   ),
    //   isOwner && isWaitingApproval && (
    //     <SecondaryButton disabled={true} key="waiting-for-approval-btn">
    //       {/* <Trans> */}
    //       Waiting for approval
    //       {/* </Trans> */}
    //     </SecondaryButton>
    //   ),
    //   isAdmin && !isApproved && (
    //     <PrimaryButton /* onClick={approveUserForm.submitForm} */ color="green" key="approve-btn">
    //       {/* <Trans> */}
    //       Approve
    //       {/* </Trans> */}
    //     </PrimaryButton>
    //   ),
    //   isAdmin && isApproved && (
    //     <SecondaryButton
    //       // onClick={unapproveUserForm.submitForm}
    //       color="red"
    //       key="unapprove-btn"
    //     >
    //       {/* <Trans> */}
    //       Unapprove
    //       {/* </Trans> */}
    //     </SecondaryButton>
    //   ),
    //   !isOwner && !isFollowing && (
    //     <PrimaryButton
    //       disabled={!isAuthenticated}
    //       // onClick={toggleFollowForm.submitForm}
    //       className="following-button"
    //       key="follow-btn"
    //     >
    //       {/* <Trans> */}
    //       Follow
    //       {/* </Trans> */}
    //     </PrimaryButton>
    //   ),
    //   !isOwner && isFollowing && (
    //     <SecondaryButton
    //       disabled={!isAuthenticated}
    //       // onClick={toggleFollowForm.submitForm}
    //       className="following-button"
    //       color="orange"
    //       key="following-btn"
    //     >
    //       {/* <Trans> */}
    //       Following
    //       {/* </Trans> */}
    //     </SecondaryButton>
    //   ),
    //   !isOwner && (
    //     <SecondaryButton
    //       color="grey"
    //       className={`message`}
    //       disabled={!isAuthenticated}
    //       onClick={openSendMessage}
    //       key="message-btn"
    //     >
    //       {/* <Trans> */}
    //       Message
    //       {/* </Trans> */}
    //     </SecondaryButton>
    //   ),
    moreButtonItems &&
      moreButtonItems.length > 0 &&
      isAuthenticated &&
      !isOwner && {
        Item: () => (
          <FloatingMenu
            menuContent={
              moreButtonItems.map(i => (
                <i.Item key={i.key} />
              ))
              // <div tabIndex={0} onClick={copyUrl} key="share">
              //   <Share />
              //   {/* <Trans> */}
              //   Share
              //   {/* </Trans> */}
              // </div>,
              // <div tabIndex={0} onClick={() => setIsReporting(true)} key="report">
              //   <Flag />
              //   {/* <Trans> */}
              //   Report
              //   {/* </Trans> */}
              // </div>,
            }
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
        key: 'more-button',
      },
  ]

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

  const updatedBottomItems = {
    Item: () => (
      <div className="buttons">
        {[...bottomButtons, ...(bottomItems ?? [])]
          .filter(Boolean)
          .map(i => i && <i.Item key={i.key} />)}
      </div>
    ),
    key: 'bottom-buttons',
  }

  const updatedContentItems = [
    updatedTopItems,
    cardHeader,
    description,
    // approvalInfo,
    updatedBottomItems,
    ...(contentItems ?? []),
  ].filter(Boolean)

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
      <div className="content">{updatedContentItems.map(i => i && <i.Item key={i.key} />)}</div>
    </div>
  )
}
