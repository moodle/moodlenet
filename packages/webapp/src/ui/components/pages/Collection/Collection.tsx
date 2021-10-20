import { t, Trans } from '@lingui/macro'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditIcon from '@material-ui/icons/Edit'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import SaveIcon from '@material-ui/icons/Save'
import React, { useCallback, useState } from 'react'
import { CP, withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import defaultBackgroud from '../../../static/img/default-background.svg'
import Card from '../../atoms/Card/Card'
import InputTextField from '../../atoms/InputTextField/InputTextField'
import Modal from '../../atoms/Modal/Modal'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import RoundButton from '../../atoms/RoundButton/RoundButton'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import ListCard from '../../molecules/cards/ListCard/ListCard'
import { ResourceCard, ResourceCardProps } from '../../molecules/cards/ResourceCard/ResourceCard'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/HeaderPageTemplate'
import { NewCollectionFormValues } from '../NewCollection/types'
import { ContributorCard, ContributorCardProps } from './ContributorCard/ContributorCard'
import './styles.scss'

export type CollectionProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  isAuthenticated: boolean
  isOwner: boolean
  numFollowers: number
  bookmarked: boolean
  contributorCardProps: ContributorCardProps
  formBag: FormikBag<NewCollectionFormValues>
  resourceCardPropsList: CP<ResourceCardProps>[]
  updateCollection: () => unknown
  toggleBookmark: () => unknown
  toggleFollow: () => unknown
  deleteCollection?: () => unknown
  following: boolean
}

export const Collection = withCtrl<CollectionProps>(
  ({
    headerPageTemplateProps,
    isAuthenticated,
    isOwner,
    following,
    numFollowers,
    bookmarked,
    contributorCardProps,
    formBag,
    resourceCardPropsList,
    toggleBookmark,
    updateCollection,
    deleteCollection,
    toggleFollow,
  }) => {
    /*const actionsCard = (
      <Card className="collection-actions-card" hideBorderWhenSmall={true}>
                 <PrimaryButton disabled={!isAuthenticated}>
          <Trans>Send all to Moodle</Trans>
        </PrimaryButton> 
        <SecondaryButton disabled={!isAuthenticated}>
          <Trans>Suggest Resource</Trans>
        </SecondaryButton>
      </Card>
    )*/

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isToDelete, setIsToDelete] = useState<boolean>(false)
    const [isShowingBackground, setIsShowingBackground] = useState<boolean>(false)

    const [form, formAttrs] = formBag
    const setFieldValue = form.setFieldValue
    const setTitleField = useCallback((_: string) => setFieldValue('title', _), [setFieldValue])
    const setDescriptionField = useCallback((_: string) => setFieldValue('description', _), [setFieldValue])

    const background = {
      backgroundImage: form.values.imageUrl ? 'url(' + form.values.imageUrl + ')' : 'url(' + defaultBackgroud + ')',
      backgroundSize: 'cover',
    }

    const selectImage = () => {
      document.getElementById('upload-image')?.click()
    }

    const uploadImage = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e?.currentTarget.files?.item(0)
        selectedFile && setFieldValue('image', selectedFile)
      },
      [setFieldValue],
    )

    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        {isShowingBackground && typeof form.values.image === 'string' && (
          <Modal
            className="image-modal"
            closeButton={false}
            onClose={() => setIsShowingBackground(false)}
            style={{ maxWidth: '90%', maxHeight: '90%' }}
          >
            <img src={form.values.image} alt="Cover" />
          </Modal>
        )}
        {isToDelete && deleteCollection && (
          <Modal
            title={t`Alert`}
            actions={
              <PrimaryButton
                onClick={() => {
                  deleteCollection()
                  setIsToDelete(false)
                }}
                color="red"
              >
                <Trans>Delete</Trans>
              </PrimaryButton>
            }
            onClose={() => setIsToDelete(false)}
            style={{ maxWidth: '400px' }}
            className="delete-message"
          >
            <Trans>The collection will be deleted</Trans>
          </Modal>
        )}
        <div className="collection">
          <div className="content">
            <Card className="main-collection-card" hideBorderWhenSmall={true}>
              <div className="image" style={background} onClick={() => !isEditing && setIsShowingBackground(true)}>
                {isEditing && (
                  <input id="upload-image" type="file" accept=".jpg,.jpeg,.png,.gif" onChange={uploadImage} hidden />
                )}
                {isEditing && <RoundButton className="change-image-button" type="edit" onClick={selectImage} />}
              </div>
              <div className="info">
                <div className="label">
                  <Trans>Collection</Trans>
                  <div className={`actions ${isOwner ? 'edit-save' : ''}`}>
                    {isAuthenticated && !isEditing && (
                      <div className={`bookmark ${bookmarked && 'bookmarked'}`} onClick={toggleBookmark}>
                        {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </div>
                    )}
                    {isOwner && isEditing && (
                      <PrimaryButton
                        color="green"
                        onHoverColor="orange"
                        onClick={() => {
                          updateCollection()
                          setIsEditing(false)
                        }}
                      >
                        <SaveIcon />
                      </PrimaryButton>
                    )}
                    {isOwner && !isEditing && (
                      <SecondaryButton onClick={() => setIsEditing(true)} color="orange">
                        <EditIcon />
                      </SecondaryButton>
                    )}
                  </div>
                </div>
                {isOwner ? (
                  <InputTextField
                    className="title"
                    autoUpdate={true}
                    value={form.values.title}
                    displayMode={true}
                    edit={isEditing}
                    {...formAttrs.title}
                    getText={setTitleField}
                  />
                ) : (
                  <div className="title">{form.values.title}</div>
                )}
                {isOwner ? (
                  <InputTextField
                    autoUpdate={true}
                    textAreaAutoSize={true}
                    value={form.values.description}
                    textarea={true}
                    displayMode={true}
                    edit={isEditing}
                    {...formAttrs.description}
                    getText={setDescriptionField}
                  />
                ) : (
                  <div className="description">{form.values.description}</div>
                )}
                <div className="actions">
                  <div className="left">
                    {isAuthenticated &&
                      !isOwner &&
                      (following ? (
                        <div className="follow-and-followers">
                          <SecondaryButton onClick={toggleFollow}>
                            <Trans>Unfollow</Trans>
                          </SecondaryButton>
                        </div>
                      ) : (
                        <div className="follow-and-followers">
                          <PrimaryButton onClick={toggleFollow}>
                            <Trans>Follow</Trans>
                          </PrimaryButton>
                        </div>
                      ))}
                    <div className={`followers`}>
                      <PermIdentityIcon />
                      <span>{numFollowers}</span>
                    </div>
                  </div>
                  <div className="right">
                    {isEditing && (
                      <SecondaryButton color="red" onHoverColor="filled-red" onClick={() => setIsToDelete(true)}>
                        <DeleteOutlineIcon />
                      </SecondaryButton>
                    )}
                  </div>
                </div>
              </div>
            </Card>
            <div className="main-content">
              <div className={`main-column ${isOwner ? 'full-width' : ''}`}>
                <ListCard
                  content={resourceCardPropsList.map(resourceCardProps => {
                    return <ResourceCard {...resourceCardProps} isEditing={isEditing} />
                  })}
                  className="resources no-card"
                />
                <div className="collection-footer">
                  <div className="left-column">{!isOwner && <ContributorCard {...contributorCardProps} />}</div>
                  <div className="right-column">{/*actionsCard*/}</div>
                  <div className="one-column">
                    {/*actionsCard*/}
                    {!isOwner && <ContributorCard {...contributorCardProps} />}
                  </div>
                </div>
              </div>
              {!isOwner && (
                <div className="side-column">
                  <ContributorCard {...contributorCardProps} />
                  {/*actionsCard*/}
                </div>
              )}
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)
