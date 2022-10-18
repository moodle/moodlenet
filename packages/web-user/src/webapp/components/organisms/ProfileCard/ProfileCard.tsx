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
import { InputTextField, Modal } from '@moodlenet/component-library'
import { FC, useState } from 'react'
import './ProfileCard.scss'

export type ProfileCardProps = {
  displayName: string
  avatarUrl?: string
  backgroundUrl?: string
  location?: string
  isAuthenticated: boolean
  isEditing?: boolean
}

export const ProfileCard: FC<ProfileCardProps> = ({
  displayName,
  avatarUrl,
  backgroundUrl,
  isEditing,
  location,
  isAuthenticated,
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
  console.log(isAuthenticated)

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
      <div className="actions"></div>

      <div className="info">
        <div className="profile-card-header">
          <div className="title">
            <div className="display-name">
              {/* {editForm.values.displayName} */}
              {displayName}
            </div>
          </div>

          <div className="subtitle">
            {/* {editForm.values.displayName && (
              <span>
                <span className="at-symbol">@</span>
                {editForm.values.displayName}
              </span>
            )}

            {editForm.values.organizationName && editForm.values.organizationName !== '' && (
              <span>{editForm.values.organizationName}</span>
            )} */}

            <span>{location}</span>
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
        <InputTextField
          textAreaAutoSize={true}
          textarea={true}
          displayMode={true}
          className="underline"
          placeholder="What should others know about you?"
          name="description"
        />
      </div>
    </div>
  )
}