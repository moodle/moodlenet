import { InputTextField, Modal, PrimaryButton } from '@moodlenet/component-library'
import { MainLayout, MainLayoutProps } from '@moodlenet/react-app/ui.mjs'
import { ComponentType, FC, useState } from 'react'
import { OverallCard, OverallCardProps } from '../../molecules/OverallCard/OverallCard.js'
import { ProfileCard, ProfileCardProps } from '../../organisms/ProfileCard/ProfileCard.js'
import './Profile.scss'

export type ProfileProps = {
  mainLayoutProps: MainLayoutProps
  overallCardProps: OverallCardProps
  profileCardProps: ProfileCardProps
  mainColumnContent?: { Comp: ComponentType<{ callback(): void }>; key: string; callback(): void }[]
  displayName: string
  // mainColumnContent?: { Comp: ComponentType; key: string }[]
}

export const Profile: FC<ProfileProps> = ({
  mainLayoutProps,
  overallCardProps,
  profileCardProps,
  mainColumnContent,
  displayName,
}) => {
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false)

  const modals = [
    isSendingMessage /* && sendEmailForm  */ && (
      <Modal
        title={`${/* t */ `Send a message to`} ${displayName}`}
        actions={
          <PrimaryButton
            onClick={() => {
              // sendEmailForm.submitForm()
              setIsSendingMessage(false)
            }}
          >
            {/* <Trans> */}
            Send
            {/* </Trans> */}
          </PrimaryButton>
        }
        onClose={() => setIsSendingMessage(false)}
        style={{ maxWidth: '400px' }}
      >
        <InputTextField
          textarea={true}
          name="text"
          edit
          // onChange={sendEmailForm.handleChange}
        />
      </Modal>
    ),
  ]

  return (
    <MainLayout {...mainLayoutProps}>
      {modals}
      <div className="profile">
        <div className="content">
          <div className="main-column">
            <ProfileCard
              {...profileCardProps}
              openSendMessage={() => setIsSendingMessage(/* !!sendEmailForm */ true)}
            />
            {mainColumnContent?.map(({ Comp, key, callback }) => {
              return <Comp key={key} callback={callback} />
            })}
          </div>
          <div className="side-column">
            <OverallCard {...overallCardProps} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
Profile.displayName = 'ProfilePage'
export default Profile
