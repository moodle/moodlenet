import { t, Trans } from '@lingui/macro'
import LibraryAddIcon from '@material-ui/icons/LibraryAdd'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import { useState } from 'react'
import { Href, Link } from '../../../elements/link'
import { CP, withCtrl } from '../../../lib/ctrl'
import InputTextField from '../../atoms/InputTextField/InputTextField'
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

export type ProfileProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  overallCardProps: OverallCardProps
  profileCardProps: Omit<
    ProfileCardProps,
    'isEditing' | 'toggleIsEditing' | 'openSendMessage'
  >
  collectionCardPropsList: CP<CollectionCardProps>[]
  resourceCardPropsList: CP<ResourceCardProps>[]
  displayName: string
  newCollectionHref: Href
  newResourceHref: Href
  showAccountCreationSuccessAlert?: boolean
  showAccountApprovedSuccessAlert?: boolean
  sendEmail?: (text: string) => unknown
  save: () => unknown
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
    sendEmail,
    save,
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false)

    const toggleIsEditing = () => {
      setIsEditing(!isEditing)
      if (isEditing) {
        save()
      }
    }

    const collectionList = (
      <ListCard
        className="collections"
        title={`${t`Collections curated by`} ${displayName}`}
        content={collectionCardPropsList.map((collectionCardProps) => (
          <CollectionCard {...collectionCardProps} isEditing={isEditing} />
        ))}
        actions={
          profileCardProps.isOwner && (
            <Link href={newCollectionHref}>
              <PrimaryButton className="action">
                <LibraryAddIcon />
                <Trans>New collection</Trans>
              </PrimaryButton>
            </Link>
          )
        }
      ></ListCard>
    )

    const [emailText, setEmailText] = useState('')
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
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
        {isSendingMessage && sendEmail && (
          <Modal
            title={`${t`Send a message to`} ${displayName}`}
            actions={[
              <PrimaryButton
                onClick={() => {
                  sendEmail(emailText)
                  setIsSendingMessage(false)
                }}
              >
                <Trans>Send</Trans>
              </PrimaryButton>,
            ]}
            onClose={() => setIsSendingMessage(false)}
            style={{ maxWidth: '400px' }}
          >
            <InputTextField textarea={true} getText={setEmailText} autoUpdate />
          </Modal>
        )}
        <div className="profile">
          <div className="content">
            <div className="main-column">
              <ProfileCard
                {...profileCardProps}
                isEditing={isEditing}
                toggleIsEditing={toggleIsEditing}
                openSendMessage={() => setIsSendingMessage(!!sendEmail && true)}
              />
              <ListCard
                className="resources"
                content={resourceCardPropsList.map((resourcesCardProps) => {
                  return (
                    <ResourceCard
                      {...resourcesCardProps}
                      isEditing={isEditing}
                    />
                  )
                })}
                title={t`Latest resources`}
                actions={
                  profileCardProps.isOwner && (
                    <Link href={newResourceHref}>
                      <PrimaryButton className="action">
                        <NoteAddIcon />
                        <Trans>New resource</Trans>
                      </PrimaryButton>
                    </Link>
                  )
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
