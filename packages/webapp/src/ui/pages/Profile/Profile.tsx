import { t, Trans } from '@lingui/macro'
import { useState } from 'react'
import InputTextField from '../../components/atoms/InputTextField/InputTextField'
import Modal from '../../components/atoms/Modal/Modal'
import PrimaryButton from '../../components/atoms/PrimaryButton/PrimaryButton'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import { ListCard } from '../../components/cards/ListCard/ListCard'
import { OverallCard, OverallCardProps } from '../../components/cards/OverallCard/OverallCard'
import { ProfileCard, ProfileCardProps } from '../../components/cards/ProfileCard/ProfileCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

export type ProfileProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  overallCardProps: OverallCardProps
  profileCardProps: Omit<ProfileCardProps, 'isEditing' | 'toggleIsEditing' | 'openSendMessage'>
  collectionCardPropsList: CP<CollectionCardProps>[]
  resourceCardPropsList: CP<ResourceCardProps>[]
  displayName: string
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
        title={`${t`Collections curated by`} ${displayName}`}
        content={collectionCardPropsList.map(collectionCardProps => (
          <CollectionCard {...collectionCardProps} isEditing={isEditing} />
        ))}
        className="collections"
      />
    )

    const [emailText, setEmailText] = useState('')
    console.log({ emailText })
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        {isSendingMessage && sendEmail && (
          <Modal
            title={t`Send a message to ${displayName}`}
            actions={
              <PrimaryButton
                onClick={() => {
                  sendEmail(emailText)
                  setIsSendingMessage(false)
                }}
              >
                <Trans>Send</Trans>
              </PrimaryButton>
            }
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
                content={resourceCardPropsList.map(resourcesCardProps => {
                  return <ResourceCard {...resourcesCardProps} isEditing={isEditing} />
                })}
                title={t`Latest Resources`}
                className="resources"
              />
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
  },
)
Profile.displayName = 'ProfilePage'
