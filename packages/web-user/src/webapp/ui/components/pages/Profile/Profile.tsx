import type { AddonItem } from '@moodlenet/component-library'
import type { MainLayoutProps, OverallCardItem, ProxyProps } from '@moodlenet/react-app/ui'
import { MainLayout, OverallCard, useViewport } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import type { FC } from 'react'
import { useReducer } from 'react'
import type {
  ProfileAccess,
  ProfileActions,
  ProfileData,
  ProfileFormValues,
  ProfileState,
} from '../../../../../common/types.mjs'

import type { CollectionCardProps } from '@moodlenet/collection/ui'
import type { ResourceCardProps } from '@moodlenet/ed-resource/ui'
import type { ValidationSchemas } from '../../../../../common/validationSchema.mjs'
import type { MainProfileCardSlots } from '../../organisms/MainProfileCard/MainProfileCard.js'
import { MainProfileCard } from '../../organisms/MainProfileCard/MainProfileCard.js'
import ProfileCollectionList from '../../organisms/ProfileCollectionList/ProfileCollectionList.js'
import ProfileResourceList from '../../organisms/ProfileResourceList/ProfileResourceList.js'
import { UserProgressCard } from '../../organisms/UserProgressCard/UserProgressCard.js'
import './Profile.scss'

export type ProfileProps = {
  mainLayoutProps: MainLayoutProps

  wideColumnItems: AddonItem[]
  mainColumnItems: AddonItem[]
  rightColumnItems: AddonItem[]

  mainProfileCardSlots: MainProfileCardSlots
  profileForm: ProfileFormValues
  validationSchemas: ValidationSchemas

  resourceCardPropsList: { key: string; props: ProxyProps<ResourceCardProps> }[]
  collectionCardPropsList: { key: string; props: ProxyProps<CollectionCardProps> }[]
  createResource(): void
  createCollection(): void

  overallCardItems: OverallCardItem[]
  // userProgressCardProps: UserProgressCardProps

  data: ProfileData
  state: ProfileState
  actions: ProfileActions
  access: ProfileAccess
}

export const Profile: FC<ProfileProps> = ({
  mainLayoutProps,
  wideColumnItems,
  mainColumnItems,
  rightColumnItems,

  mainProfileCardSlots,
  profileForm,
  validationSchemas,

  resourceCardPropsList,
  createResource,
  collectionCardPropsList,
  createCollection,

  overallCardItems,
  // userProgressCardProps,

  data,
  state,
  actions,
  access,
}) => {
  const viewport = useViewport()
  const { points } = data
  const { editProfile } = actions
  const { canEdit } = access
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
    validationSchema: validationSchemas.profileValidationSchema,
    onSubmit: values => {
      return editProfile(values)
    },
  })

  const resourceList = (
    <ProfileResourceList
      key="profile-resource-list"
      canEdit={canEdit}
      createResource={createResource}
      resourceCardPropsList={resourceCardPropsList}
    />
  )

  const collectionList = (
    <ProfileCollectionList
      key="profile-collection-list"
      canEdit={canEdit}
      createCollection={createCollection}
      collectionCardPropsList={collectionCardPropsList}
    />
  )

  const updateOverallCardItems = [...(overallCardItems ?? [])].filter(
    (item): item is OverallCardItem => !!item,
  )

  const overallCard = <OverallCard items={updateOverallCardItems} />

  const userProgressCard = <UserProgressCard points={points} />

  // const modals = [
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
  //     <Snackbar type="success" position="bottom" autoHideDuration={3000} showCloseButton={false}>
  //       {/* <Trans> */}
  //       Reported
  //       {/* </Trans> */}
  //     </Snackbar>
  //   ),
  //   showUrlCopiedAlert && (
  //     <Snackbar type="success" position="bottom" autoHideDuration={3000} showCloseButton={false}>
  //       {/* <Trans> */}
  //       Copied to clipoard
  //       {/* </Trans> */}
  //     </Snackbar>
  //   ),
  //   showUserIdCopiedAlert && (
  //     <Snackbar type="success" position="bottom" autoHideDuration={3000} showCloseButton={false}>
  //       {/* <Trans> */}
  //       User ID copied to the clipboard, use it to connect with Moodle LMS
  //       {/* </Trans> */}
  //     </Snackbar>
  //   ),
  //   showAccountCreationSuccessAlert && (
  //     <Snackbar type="success" position="bottom" autoHideDuration={3000} showCloseButton={false}>
  //       {/* <Trans> */}
  //       Account activated! Feel free to complete your profile
  //       {/* </Trans> */}
  //     </Snackbar>
  //   ),
  //   showAccountApprovedSuccessAlert && (
  //     <Snackbar
  //       position="bottom"
  //       type="success"
  //       autoHideDuration={3000}
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
  //     autoHideDuration={3000}
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
      validationSchemas={validationSchemas}
      slots={mainProfileCardSlots}
      data={data}
      form={form}
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

  const updatedWideColumnItems = [
    !viewport.screen.big && mainProfileCard,
    !viewport.screen.big && resourceList,
    !viewport.screen.big && collectionList,
    ...(wideColumnItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const updatedMainColumnItems = [
    viewport.screen.big && mainProfileCard,
    viewport.screen.big && resourceList,
    !viewport.screen.big && userProgressCard,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const updatedRightColumnItems = [
    viewport.screen.big && userProgressCard,
    overallCard,
    viewport.screen.big && collectionList,
    ...(rightColumnItems ?? []),
  ].filter((item): item is AddonItem /* | JSX.Element */ => !!item)

  // console.log('viewport ', viewport.screen.type)
  return (
    <MainLayout {...mainLayoutProps}>
      {/* {modals} {snackbars} */}
      <div className="profile">
        <div className="content">
          {updatedWideColumnItems.length > 0 && (
            <div className="wide-column">
              {updatedWideColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
            </div>
          )}
          {(updatedMainColumnItems.length > 0 || updatedRightColumnItems.length > 0) && (
            <div className="main-and-right-columns">
              {updatedMainColumnItems.length > 0 && (
                <div className="main-column">
                  {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
                </div>
              )}
              {updatedRightColumnItems.length > 0 && (
                <div className="right-column">
                  {updatedRightColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
Profile.displayName = 'ProfilePage'
export default Profile
