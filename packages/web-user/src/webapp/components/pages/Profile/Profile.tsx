import { AddonItem } from '@moodlenet/component-library'
import { MainLayout, MainLayoutProps } from '@moodlenet/react-app/ui'
import { FC, useState } from 'react'
import { ProfileCard, ProfileCardPropsControlled } from '../../organisms/ProfileCard/ProfileCard.js'
import './Profile.scss'

export type ProfileProps = {
  mainLayoutProps: MainLayoutProps
  profileCardProps: ProfileCardPropsControlled
  mainColumnItems?: AddonItem[]
  sideColumnItems?: AddonItem[]
  // displayName: string
  // showAccountCreationSuccessAlert?: boolean
  // showAccountApprovedSuccessAlert?: boolean
  // mainColumnContent?: { Comp: ComponentType; key: string }[]
}

export const Profile: FC<ProfileProps> = ({
  mainLayoutProps,
  profileCardProps,
  mainColumnItems,
  sideColumnItems,
  // displayName,
  // showAccountApprovedSuccessAlert,
  // showAccountCreationSuccessAlert,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  // const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false)
  // const [showUserIdCopiedAlert, setShowUserIdCopiedAlert] = useState<boolean>(false)
  // const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  // const [showReportedAlert, setShowReportedAlert] = useState<boolean>(false)
  // const [showMessageSentAlert, setShowMessageSentAlert] = useState<boolean>(false)
  // const [isReporting, setIsReporting] = useState<boolean>(false)

  const toggleIsEditing = () => {
    isEditing /* && editForm.dirty && editForm.submitForm() */
    setIsEditing(!isEditing)
  }

  // const modals = [
  //   isSendingMessage /* && sendEmailForm  */ && (
  //     <Modal
  //       title={`${/* t */ `Send a message to`} ${displayName}`}
  //       actions={
  //         <PrimaryButton
  //           onClick={() => {
  //             // sendEmailForm.submitForm()
  //             setShowMessageSentAlert(false)
  //             setTimeout(() => {
  //               setShowMessageSentAlert(true)
  //               setIsSendingMessage(false)
  //             }, 100)
  //           }}
  //         >
  //           {/* <Trans> */}
  //           Send
  //           {/* </Trans> */}
  //         </PrimaryButton>
  //       }
  //       onClose={() => undefined}
  //       style={{ maxWidth: '400px' }}
  //     >
  //       <InputTextField
  //         textarea={true}
  //         name="text"
  //         edit
  //         // onChange={sendEmailForm.handleChange}
  //       />
  //     </Modal>
  //   ),
  //   isReporting && (
  //     /* reportForm && */ <ReportModal
  //       // reportForm={reportForm}
  //       title={/* t */ `Confirm reporting this profile`}
  //       setIsReporting={setIsReporting}
  //       setShowReportedAlert={setShowReportedAlert}
  //     />
  //   ),
  // ]

  // const snackbars = [
  //   showReportedAlert && (
  //     <Snackbar type="success" position="bottom" autoHideDuration={6000} showCloseButton={false}>
  //       {/* <Trans> */}
  //       Reported
  //       {/* </Trans> */}
  //     </Snackbar>
  //   ),
  //   showUrlCopiedAlert && (
  //     <Snackbar type="success" position="bottom" autoHideDuration={6000} showCloseButton={false}>
  //       {/* <Trans> */}
  //       Copied to clipoard
  //       {/* </Trans> */}
  //     </Snackbar>
  //   ),
  //   showMessageSentAlert && (
  //     <Snackbar type="success" position="bottom" autoHideDuration={6000} showCloseButton={false}>
  //       {/* <Trans> */}
  //       Message sent
  //       {/* </Trans> */}
  //     </Snackbar>
  //   ),
  //   showUserIdCopiedAlert && (
  //     <Snackbar type="success" position="bottom" autoHideDuration={6000} showCloseButton={false}>
  //       {/* <Trans> */}
  //       User ID copied to the clipboard, use it to connect with Moodle LMS
  //       {/* </Trans> */}
  //     </Snackbar>
  //   ),
  //   showAccountCreationSuccessAlert && (
  //     <Snackbar type="success" position="bottom" autoHideDuration={6000} showCloseButton={false}>
  //       {/* <Trans> */}
  //       Account activated! Feel free to complete your profile
  //       {/* </Trans> */}
  //     </Snackbar>
  //   ),
  //   showAccountApprovedSuccessAlert && (
  //     <Snackbar
  //       position="bottom"
  //       type="success"
  //       autoHideDuration={6000}
  //       waitDuration={1000}
  //       showCloseButton={false}
  //     >
  //       {/* <Trans> */}
  //       Congratulations! Your account has been approved
  //       {/* </Trans> */}
  //     </Snackbar>
  //   ),
  // editForm.isSubmitting && (
  //   <Snackbar
  //     position="bottom"
  //     type="info"
  //     waitDuration={200}
  //     autoHideDuration={6000}
  //     showCloseButton={false}
  //   >
  //     {/* <Trans> */}
  //       Content uploading, please don't close the tab
  //       {/* </Trans> */}
  //   </Snackbar>
  // )
  // ]

  const profileCard = {
    Item: () => (
      <ProfileCard
        {...profileCardProps}
        // editForm={editForm}
        isEditing={isEditing}
        toggleIsEditing={toggleIsEditing}
        // setShowUserIdCopiedAlert={setShowUserIdCopiedAlert}
        // setShowUrlCopiedAlert={setShowUrlCopiedAlert}
        // setIsReporting={setIsReporting}
        // openSendMessage={() => setIsSendingMessage(/* !!sendEmailForm */ true)}
      />
    ),
    key: 'profile-card',
  }

  const updatedMainColumnItems: AddonItem[] = [profileCard, ...(mainColumnItems ?? [])]

  return (
    <MainLayout {...mainLayoutProps}>
      {/* {modals} {snackbars} */}
      <div className="profile">
        <div className="content">
          <div className="main-column">
            {updatedMainColumnItems.map(i => (
              <i.Item key={i.key} />
            ))}
          </div>
          <div className="side-column">
            {sideColumnItems?.map(i => (
              <i.Item key={i.key} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
Profile.displayName = 'ProfilePage'
export default Profile
