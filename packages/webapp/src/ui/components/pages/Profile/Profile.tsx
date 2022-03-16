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
    | 'editForm'
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
  editForm: FormikHandle<ProfileFormValues>
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
    editForm,
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false)
    const [showUserIdCopiedAlert, setShowUserIdCopiedAlert] =
      useState<boolean>(false)

    const toggleIsEditing = () => {
      isEditing && editForm.dirty && editForm.submitForm()
      setIsEditing(!isEditing)
    }

    const collectionList = (
      <ListCard
        className="collections"
        title={`${t`Collections curated by`} ${displayName}`}
        content={collectionCardPropsList.map((collectionCardProps) => (
          <CollectionCard {...collectionCardProps} isEditing={isEditing} />
        ))}
        actions={
          profileCardProps.isOwner
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
        {editForm.isSubmitting && (
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
        <div className="profile">
          <div className="content">
            <div className="main-column">
              <ProfileCard
                {...profileCardProps}
                editForm={editForm}
                isEditing={isEditing}
                toggleIsEditing={toggleIsEditing}
                setShowUserIdCopiedAlert={setShowUserIdCopiedAlert}
                openSendMessage={() => setIsSendingMessage(!!sendEmailForm)}
              />
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
                  profileCardProps.isOwner
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
              ></ListCard>
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
