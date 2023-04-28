import { AddonItem } from '@moodlenet/component-library'
import { MainLayout, MainLayoutProps, OverallCard, OverallCardProps } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { FC, useReducer } from 'react'
import { SchemaOf } from 'yup'
import {
  ProfileAccess,
  ProfileActions,
  ProfileData,
  ProfileFormValues,
  ProfileState,
} from '../../../../../common/types.mjs'

import { CollectionCardProps, ProfileCollectionList } from '@moodlenet/collection/ui'
import { ProfileResourceList, ResourceCardProps } from '@moodlenet/ed-resource/ui'
import { Href } from '@moodlenet/react-app/common'
import {
  MainProfileCard,
  MainProfileCardSlots,
} from '../../organisms/MainProfileCard/MainProfileCard.js'
import './Profile.scss'

export type ProfileProps = {
  mainLayoutProps: MainLayoutProps

  mainColumnItems: AddonItem[]
  sideColumnItems: AddonItem[]

  mainProfileCardSlots: MainProfileCardSlots
  profileForm: ProfileFormValues
  validationSchema: SchemaOf<ProfileFormValues>

  resourceCardPropsList: ResourceCardProps[]
  collectionCardPropsList: CollectionCardProps[]
  newResourceHref: Href //@BRU ask for a `callback():void` instead of an `Href`, it works this way now
  newCollectionHref: Href //@BRU ask for a `callback():void` instead of an `Href`, it works this way now
  overallCardProps: OverallCardProps //@BRU you probably want OverallCardItem[] instead of OverallCardProps here right ?

  data: ProfileData
  state: ProfileState
  actions: ProfileActions
  access: ProfileAccess
}

export const Profile: FC<ProfileProps> = ({
  mainLayoutProps,
  mainColumnItems,
  sideColumnItems,

  mainProfileCardSlots,
  profileForm,
  validationSchema,

  resourceCardPropsList,
  newResourceHref,
  collectionCardPropsList,
  newCollectionHref,
  overallCardProps,

  data,
  state,
  actions,
  access,
}) => {
  const { editProfile, setAvatarImage, setBackgroundImage } = actions
  const { profileUrl } = state
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

  const avatarForm = useFormik<{ image: File | null }>({
    initialValues: { image: null },
    validationSchema: validationSchema,
    onSubmit: values => {
      return values.image ? setAvatarImage(values.image) : undefined
    },
  })

  const backgroundForm = useFormik<{ image: File | null }>({
    initialValues: { image: null },
    validationSchema: validationSchema,
    onSubmit: values => {
      return values.image ? setBackgroundImage(values.image) : undefined
    },
  })

  const resourceList = (
    <ProfileResourceList
      key="profile-resource-list"
      isCreator={false}
      newResourceHref={newResourceHref}
      resourceCardPropsList={resourceCardPropsList}
    />
  )

  const collectionList = (
    <ProfileCollectionList
      key="profile-collection-list"
      isCreator={false}
      newCollectionHref={newCollectionHref}
      collectionCardPropsList={collectionCardPropsList}
    />
  )

  const overallCard = <OverallCard {...overallCardProps} />

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

  const mainProfileCard = (
    <MainProfileCard
      key="main-profile-card"
      slots={mainProfileCardSlots}
      data={data}
      form={form}
      avatarForm={avatarForm}
      backgroundForm={backgroundForm}
      profileUrl={profileUrl}
      access={access}
      actions={actions}
      state={state}
      isEditing={isEditing}
      toggleIsEditing={toggleIsEditing}
      // setShowUserIdCopiedAlert={setShowUserIdCopiedAlert}
      // setShowUrlCopiedAlert={setShowUrlCopiedAlert}
      // setIsReporting={setIsReporting}
      // openSendMessage={() => setIsSendingMessage(/* !!sendEmailForm */ true)}
    />
  )

  const updatedMainColumnItems = [
    mainProfileCard,
    resourceList,
    collectionList,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const updatedSideColumnItems = [overallCard, collectionList, ...(sideColumnItems ?? [])].filter(
    (item): item is AddonItem /* | JSX.Element */ => !!item,
  )

  return (
    <MainLayout {...mainLayoutProps}>
      {/* {modals} {snackbars} */}
      <div className="profile">
        <div className="content">
          <div className="main-column">
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
