import { AddonItem } from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC, useReducer } from 'react'
import { SchemaOf } from 'yup'
import { ProfileAccess, ProfileActions, ProfileFormValues } from '../../../../../common/types.mjs'
import MainLayout, { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
import { ProfileCard, ProfileCardSlots } from '../../organisms/ProfileCard/ProfileCard.js'
import './Profile.scss'

export type ProfileProps = {
  mainLayoutProps: MainLayoutProps
  mainColumnItems?: AddonItem[]
  sideColumnItems?: AddonItem[]

  profileCardSlots: ProfileCardSlots
  profileForm: ProfileFormValues
  validationSchema: SchemaOf<ProfileFormValues>

  actions: ProfileActions
  access: ProfileAccess
}

export const Profile: FC<ProfileProps> = ({
  mainLayoutProps,
  mainColumnItems,
  sideColumnItems,

  profileCardSlots,
  profileForm,
  validationSchema,

  actions,
  access,
}) => {
  const { editProfile } = actions
  const [isEditing, toggleIsEditing] = useReducer(_ => !_, false)
  // const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false)
  // const [showUserIdCopiedAlert, setShowUserIdCopiedAlert] = useState<boolean>(false)
  // const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  // const [showReportedAlert, setShowReportedAlert] = useState<boolean>(false)
  // const [showMessageSentAlert, setShowMessageSentAlert] = useState<boolean>(false)
  // const [isReporting, setIsReporting] = useState<boolean>(false)

  const form = useFormik<ProfileFormValues>({
    initialValues: profileForm,
    validationSchema: validationSchema,
    onSubmit: values => {
      return editProfile(values)
    },
  })

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

  const updatedMainColumnItems = [...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem /* | JSX.Element  */ => !!item,
  )
  const updatedSideColumnItems = [...(sideColumnItems ?? [])].filter(
    (item): item is AddonItem /* | JSX.Element */ => !!item,
  )

  return (
    <MainLayout {...mainLayoutProps}>
      {/* {modals} {snackbars} */}
      <div className="profile">
        <div className="content">
          <div className="main-column">
            <ProfileCard
              slots={profileCardSlots}
              form={form}
              access={access}
              actions={actions}
              // editForm={editForm}
              isEditing={isEditing}
              toggleIsEditing={toggleIsEditing}
              // setShowUserIdCopiedAlert={setShowUserIdCopiedAlert}
              // setShowUrlCopiedAlert={setShowUrlCopiedAlert}
              // setIsReporting={setIsReporting}
              // openSendMessage={() => setIsSendingMessage(/* !!sendEmailForm */ true)}
            />
            {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
          </div>
          <div className="side-column">
            {updatedSideColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
Profile.displayName = 'ProfilePage'
export default Profile
