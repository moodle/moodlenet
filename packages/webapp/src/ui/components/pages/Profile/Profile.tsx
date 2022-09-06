import { t, Trans } from '@lingui/macro'
import LibraryAddIcon from '@material-ui/icons/LibraryAdd'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import { useState } from 'react'
import { Href, Link } from '../../../elements/link'
import { CP, withCtrl } from '../../../lib/ctrl'
import { FormikHandle } from '../../../lib/formik'
import { InputTextField } from '../../atoms/InputTextField/InputTextField'
import Modal from '../../atoms/Modal/Modal'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import Snackbar from '../../atoms/Snackbar/Snackbar'
import {
  CollectionCard,
  CollectionCardProps,
} from '../../molecules/cards/CollectionCard/CollectionCard'
import { ListCard } from '../../molecules/cards/ListCard/ListCard'
import {
  OverallCard,
  OverallCardProps,
} from '../../molecules/cards/OverallCard/OverallCard'
import {
  ProfileCard,
  ProfileCardProps,
} from '../../molecules/cards/ProfileCard/ProfileCard'
import {
  ResourceCard,
  ResourceCardProps,
} from '../../molecules/cards/ResourceCard/ResourceCard'
import ReportModal from '../../molecules/modals/ReportModal/ReportModal'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import './styles.scss'
import { ProfileFormValues } from './types'

export type ProfileProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  overallCardProps: OverallCardProps
  profileCardProps: Omit<
    ProfileCardProps,
    | 'isEditing'
    | 'toggleIsEditing'
    | 'openSendMessage'
    | 'form'
    | 'setShowUserIdCopiedAlert'
    | 'setShowUrlCopiedAlert'
    | 'setIsReporting'
    | 'setShowUserIdCopiedAlert'
  >
  collectionCardPropsList: CP<CollectionCardProps>[]
  resourceCardPropsList: CP<ResourceCardProps>[]
  displayName: string
  newCollectionHref: Href
  newResourceHref: Href
  showAccountCreationSuccessAlert?: boolean
  showAccountApprovedSuccessAlert?: boolean
  sendEmailForm?: FormikHandle<{ text: string }>
  reportForm?: FormikHandle<{ comment: string }>
  form: FormikHandle<ProfileFormValues>
  isOwner?: boolean
}

export const Profile = withCtrl<ProfileProps>(
  ({
    headerPageTemplateProps,
    overallCardProps,
    profileCardProps,
    collectionCardPropsList,
    resourceCardPropsList,
    displayName,
    newCollectionHref,
    newResourceHref,
    showAccountCreationSuccessAlert,
    showAccountApprovedSuccessAlert,
    sendEmailForm,
    reportForm,
    form,
    isOwner,
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false)
    const [showUserIdCopiedAlert, setShowUserIdCopiedAlert] =
      useState<boolean>(false)
    const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
    const [showReportedAlert, setShowReportedAlert] = useState<boolean>(false)
    const [isReporting, setIsReporting] = useState<boolean>(false)

    const toggleIsEditing = () => {
      if (isEditing && form.dirty) {
        form.submitForm()
        form.isValid && setIsEditing(false)
      } else if (isEditing && !form.dirty) {
        setIsEditing(false)
      } else if (!isEditing) {
        setIsEditing(true)
      }
    }

    const collectionList = (isOwner || collectionCardPropsList.length > 0) && (
      <ListCard
        className="collections"
        title={t`Curated collections`}
        content={collectionCardPropsList.map((collectionCardProps) => (
          <CollectionCard {...collectionCardProps} isEditing={isEditing} />
        ))}
        actions={
          isOwner
            ? {
                element: (
                  <Link href={newCollectionHref}>
                    <PrimaryButton className="action">
                      <LibraryAddIcon />
                      <Trans>New collection</Trans>
                    </PrimaryButton>
                  </Link>
                ),
                position: 'end',
              }
            : undefined
        }
      ></ListCard>
    )

    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        {showReportedAlert && (
          <Snackbar
            type="success"
            position="bottom"
            autoHideDuration={6000}
            showCloseButton={false}
          >
            <Trans>Reported</Trans>
          </Snackbar>
        )}
        {showUrlCopiedAlert && (
          <Snackbar
            type="success"
            position="bottom"
            autoHideDuration={6000}
            showCloseButton={false}
          >
            <Trans>Copied to clipoard</Trans>
          </Snackbar>
        )}
        {showUserIdCopiedAlert && (
          <Snackbar
            type="success"
            position="bottom"
            autoHideDuration={6000}
            showCloseButton={false}
          >
            <Trans>
              User ID copied to the clipboard, use it to connect with Moodle LMS
            </Trans>
          </Snackbar>
        )}
        {showAccountCreationSuccessAlert && (
          <Snackbar
            type="success"
            position="bottom"
            autoHideDuration={6000}
            showCloseButton={false}
          >
            <Trans>Account activated! Feel free to complete your profile</Trans>
          </Snackbar>
        )}
        {showAccountApprovedSuccessAlert && (
          <Snackbar
            position="bottom"
            type="success"
            autoHideDuration={6000}
            waitDuration={1000}
            showCloseButton={false}
          >
            <Trans>Congratulations! Your account has been approved</Trans>
          </Snackbar>
        )}
        {form.isSubmitting && (
          <Snackbar
            position="bottom"
            type="info"
            waitDuration={200}
            autoHideDuration={6000}
            showCloseButton={false}
          >
            <Trans>Content uploading, please don't close the tab</Trans>
          </Snackbar>
        )}
        {isSendingMessage && sendEmailForm && (
          <Modal
            title={`${t`Send a message to`} ${displayName}`}
            actions={
              <PrimaryButton
                onClick={() => {
                  sendEmailForm.submitForm()
                  setIsSendingMessage(false)
                }}
              >
                <Trans>Send</Trans>
              </PrimaryButton>
            }
            onClose={() => setIsSendingMessage(false)}
            style={{ maxWidth: '400px' }}
          >
            <InputTextField
              textarea={true}
              name="text"
              edit
              onChange={sendEmailForm.handleChange}
            />
          </Modal>
        )}
        {isReporting && reportForm && (
          <ReportModal
            reportForm={reportForm}
            title={t`Confirm reporting this profile`}
            setIsReporting={setIsReporting}
            setShowReportedAlert={setShowReportedAlert}
          />
        )}
        <div className="profile">
          <div className="content">
            <div className="main-column">
              <ProfileCard
                {...profileCardProps}
                form={form}
                isEditing={isEditing}
                toggleIsEditing={toggleIsEditing}
                setShowUserIdCopiedAlert={setShowUserIdCopiedAlert}
                setShowUrlCopiedAlert={setShowUrlCopiedAlert}
                setIsReporting={setIsReporting}
                openSendMessage={() => setIsSendingMessage(!!sendEmailForm)}
              />
              {(isOwner || resourceCardPropsList.length > 0) && (
                <ListCard
                  className="resources"
                  content={resourceCardPropsList.map((resourcesCardProps) => {
                    return (
                      <ResourceCard
                        {...resourcesCardProps}
                        isEditing={isEditing}
                        orientation="horizontal"
                      />
                    )
                  })}
                  title={t`Latest resources`}
                  actions={
                    isOwner
                      ? {
                          element: (
                            <Link href={newResourceHref}>
                              <PrimaryButton className="action">
                                <NoteAddIcon />
                                <Trans>New resource</Trans>
                              </PrimaryButton>
                            </Link>
                          ),
                          position: 'end',
                        }
                      : undefined
                  }
                />
              )}
              {collectionList}
            </div>
            <div className="side-column">
              <OverallCard {...overallCardProps} />
              {collectionList}
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  }
)
Profile.displayName = 'ProfilePage'
