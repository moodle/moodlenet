// import { t, Trans } from '@lingui/macro'
// import { withCtrl } from '../../../../lib/ctrl'
// import FloatingMenu from '../../../atoms/FloatingMenu/FloatingMenu'
// import { InputTextField } from '../../../atoms/InputTextField/InputTextField'
// import Loading from '../../../atoms/Loading/Loading'
// import Modal from '../../../atoms/Modal/Modal'
// import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
// import RoundButton from '../../../atoms/RoundButton/RoundButton'
// import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton'
// import TertiaryButton from '../../../atoms/TertiaryButton/TertiaryButton'
// import { ProfileFormValues } from '../../../pages/Profile/types'
// import { InputTextField } from '@moodlenet/component-library/ui/components/atoms/InputTextField/InputTextField.js'
import { Edit, Save } from '@material-ui/icons'
import {
  AddonItem,
  InputTextField,
  Modal,
  PrimaryButton,
  SecondaryButton,
  sortAddonItems,
  TertiaryButton,
} from '@moodlenet/component-library'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { ReactComponent as ApprovedIcon } from '../../../assets/icons/approved.svg'
import './ProfileCard.scss'

export type ProfileCardProps = {
  contentItems?: AddonItem[]
  topItems?: AddonItem[]
  titleItems?: AddonItem[]
  subtitleItems?: AddonItem[]
  displayName: string
  description: string
  avatarUrl?: string
  backgroundUrl?: string
  location?: string
  siteUrl?: string
  isAuthenticated: boolean
  isEditing?: boolean
  isOwner?: boolean
  isApproved?: boolean
  userId: string
  showAccountApprovedSuccessAlert?: boolean
  setShowUserIdCopiedAlert: Dispatch<SetStateAction<boolean>>
  toggleIsEditing(): unknown
}

export const ProfileCard: FC<ProfileCardProps> = ({
  topItems,
  titleItems,
  subtitleItems,
  contentItems,
  displayName,
  description,
  userId,
  avatarUrl,
  backgroundUrl,
  location,
  siteUrl,
  isEditing,
  isAuthenticated,
  isOwner,
  isApproved,
  showAccountApprovedSuccessAlert,
  setShowUserIdCopiedAlert,
  toggleIsEditing,
}) => {
  const [isShowingAvatar, setIsShowingAvatar] = useState<boolean>(false)
  const [isShowingBackground, setIsShowingBackground] = useState<boolean>(false)
  // const shouldShowErrors = !!editForm.submitCount
  // const [_isShowingSmallCard, setIsShowingSmallCard] = useState<boolean>(false)

  // const setIsShowingSmallCardHelper = () => {
  //   setIsShowingSmallCard(window.innerWidth < 550 ? true : false)
  // }

  // useLayoutEffect(() => {
  //   window.addEventListener('resize', setIsShowingSmallCardHelper)
  //   return () => {
  //     window.removeEventListener('resize', setIsShowingSmallCardHelper)
  //   }
  // }, [])

  // const uploadBackgroundRef = useRef<HTMLInputElement>(null)
  // const selectBackground = (e: React.MouseEvent<HTMLElement>) => {
  //   e.stopPropagation()
  //   uploadBackgroundRef.current?.click()
  // }

  // const uploadAvatarRef = useRef<HTMLInputElement>(null)
  // const selectAvatar = (e: React.MouseEvent<HTMLElement>) => {
  //   e.stopPropagation()
  //   uploadAvatarRef.current?.click()
  // }

  const background = {
    backgroundImage: 'url(' + backgroundUrl + ')',
    backgroundSize: 'cover',
  }

  const avatar = {
    backgroundImage: `url(${avatarUrl})`,
    // backgroundImage: 'url(' + defaultAvatar + ')',
    // 'url(' + (me && me.avatar ? me.avatar : defaultAvatar) + ')',
    backgroundSize: 'cover',
  }

  const actions = isOwner && (
    <div className="edit-save">
      {isEditing ? (
        <PrimaryButton
          // className={`${editForm.isSubmitting ? 'loading' : ''}`}
          color="green"
          onClick={toggleIsEditing}
        >
          {/* {editForm.isSubmitting ? (
            <div className="loading">
              <Loading color="white" />
            </div>
          ) : ( */}
          <Save />
          {/* )} */}
        </PrimaryButton>
      ) : (
        <SecondaryButton onClick={toggleIsEditing} color="orange">
          <Edit />
        </SecondaryButton>
      )}
    </div>
  )

  const title = (
    <div className="display-name">
      {/* {editForm.values.displayName} */}
      {displayName}
    </div>
  )

  const descriptionField = isEditing ? (
    <InputTextField
      textAreaAutoSize={true}
      textarea={true}
      displayMode={true}
      className="underline"
      placeholder="What should others know about you?"
      name="description"
    />
  ) : (
    <div className="description">{description}</div>
  )

  const approvedIcon = !isEditing && isOwner && isApproved && (
    <abbr className={`approved-icon`} title={/* t */ `Approved`}>
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

  const copyIdButton = !isEditing && isOwner && (
    <abbr className={`user-id`} title={/* t */ `Click to copy your ID to the clipboard`}>
      <TertiaryButton className="copy-id" onClick={copyId}>
        Copy ID
      </TertiaryButton>
    </abbr>
  )

  const updatedTopItems = (
    <div className="actions">{sortAddonItems((topItems ?? []).concat(actions))}</div>
  )
  const updatedTitleItems = sortAddonItems(
    (titleItems ?? []).concat([title, approvedIcon, copyIdButton]),
  )
  const updatedSubtitleItems = sortAddonItems(
    (titleItems ?? []).concat([
      <span key="location">{location}</span>,
      <a href={siteUrl} target="_blank" rel="noreferrer" key="site-url">
        {siteUrl}
      </a>,
    ]),
  )

  const cardHeader = (
    <div className="profile-card-header">
      <div className="title">{updatedTitleItems}</div>

      <div className="subtitle">
        {updatedSubtitleItems}
        {/* {editForm.values.displayName && (
          <span>
        <span className="at-symbol">@</span>
        {editForm.values.displayName}
      </span>
    )}

    {editForm.values.organizationName && editForm.values.organizationName !== '' && (
      <span>{editForm.values.organizationName}</span>
    )} */}

        {/* {editForm.values.location && editForm.values.location !== '' && (
      <span>{editForm.values.location}</span>
      )}
      
      {editForm.values.siteUrl && editForm.values.siteUrl !== '' && (
        <a href={editForm.values.siteUrl} target="_blank" rel="noreferrer">
        {editForm.values.siteUrl}
        </a> 
      )}*/}
      </div>
    </div>
  )
  const updatedContentItems = sortAddonItems(
    (contentItems ?? []).concat([updatedTopItems, cardHeader, descriptionField]),
  )

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
        style={{
          ...background,
          // pointerEvents: editForm.isSubmitting ? 'none' : 'inherit',
        }}
        onClick={() => !isEditing && setIsShowingBackground(true)}
      ></div>
      <div
        className="avatar"
        style={{
          ...avatar,
          // pointerEvents: editForm.isSubmitting ? 'none' : 'inherit',
        }}
        onClick={() => !isEditing && setIsShowingAvatar(true)}
      ></div>
      <div className="content">{updatedContentItems}</div>
    </div>
  )
}
