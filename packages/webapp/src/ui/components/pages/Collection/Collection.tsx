import { t, Trans } from '@lingui/macro'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditIcon from '@material-ui/icons/Edit'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import SaveIcon from '@material-ui/icons/Save'
import React, { useCallback, useRef, useState } from 'react'
import { CP, withCtrl } from '../../../lib/ctrl'
import { FormikHandle } from '../../../lib/formik'
import { useImageUrl } from '../../../lib/useImageUrl'
import defaultBackgroud from '../../../static/img/default-background.svg'
import Card from '../../atoms/Card/Card'
import { InputTextField } from '../../atoms/InputTextField/InputTextField'
import Loading from '../../atoms/Loading/Loading'
import Modal from '../../atoms/Modal/Modal'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import RoundButton from '../../atoms/RoundButton/RoundButton'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import Snackbar from '../../atoms/Snackbar/Snackbar'
import {
  VisibilityDropdown,
  VisibilityNodes,
} from '../../atoms/VisibilityDropdown/VisibilityDropdown'
import ListCard from '../../molecules/cards/ListCard/ListCard'
import {
  ResourceCard,
  ResourceCardProps,
} from '../../molecules/cards/ResourceCard/ResourceCard'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import { NewCollectionFormValues } from '../NewCollection/types'
import {
  ContributorCard,
  ContributorCardProps,
} from './ContributorCard/ContributorCard'
import './styles.scss'

export type CollectionProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  isAuthenticated: boolean
  isOwner: boolean
  isAdmin: boolean
  numFollowers: number
  bookmarked: boolean
  contributorCardProps: ContributorCardProps
  form: FormikHandle<NewCollectionFormValues>
  resourceCardPropsList: CP<ResourceCardProps>[]
  toggleBookmark: FormikHandle
  toggleFollow: FormikHandle
  deleteCollection?: FormikHandle
  following: boolean
}

export const Collection = withCtrl<CollectionProps>(
  ({
    headerPageTemplateProps,
    isAuthenticated,
    isOwner,
    isAdmin,
    following,
    numFollowers,
    bookmarked,
    contributorCardProps,
    form,
    resourceCardPropsList,
    toggleBookmark,
    deleteCollection,
    toggleFollow,
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isToDelete, setIsToDelete] = useState<boolean>(false)
    const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
    const [isShowingBackground, setIsShowingBackground] =
      useState<boolean>(false)

    const handleOnEditClick = () => {
      setIsEditing(true)
    }
    const handleOnSaveClick = () => {
      if (form.isValid) {
        form.submitForm()
        setShouldShowErrors(false)
        setIsEditing(false)
      } else {
        setShouldShowErrors(true)
      }
    }
    const [imageUrl] = useImageUrl(form.values.image, defaultBackgroud)
    const background = {
      backgroundImage: 'url(' + imageUrl + ')',
      backgroundSize: 'cover',
    }
    const uploadImageRef = useRef<HTMLInputElement>(null)
    const selectImage = () => {
      uploadImageRef.current?.click()
    }

    const uploadImage = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        form.setFieldValue('image', e.currentTarget.files?.item(0))
      },
      [form]
    )

    const extraDetails = (
      <Card className="extra-details-card" hideBorderWhenSmall={true}>
        {isEditing ? (
          <VisibilityDropdown
            name="visibility"
            value={form.values.visibility}
            onChange={form.handleChange}
            disabled={!isEditing}
            edit={isEditing}
            label="Visibility"
            highlight={shouldShowErrors && !!form.errors.visibility}
            error={form.errors.visibility}
            position={{ top: 50, bottom: 25 }}
          />
        ) : (
          <div className="detail">
            <div className="title">
              <Trans>Visibility</Trans>
            </div>
            <abbr className="value icons">
              {VisibilityNodes[form.values.visibility]}
              {form.values.visibility}
            </abbr>
          </div>
        )}
      </Card>
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
                  deleteCollection.submitForm()
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
        <div className="collection">
          <div className="content">
            <Card className="main-collection-card" hideBorderWhenSmall={true}>
              <div
                className="image"
                style={background}
                onClick={() => !isEditing && setIsShowingBackground(true)}
              >
                {isEditing && (
                  <input
                    ref={uploadImageRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={uploadImage}
                    hidden
                  />
                )}
                {isEditing && (
                  <RoundButton
                    className="change-image-button"
                    type="edit"
                    onClick={selectImage}
                  />
                )}
              </div>
              <div className="info">
                <div className="label">
                  <Trans>Collection</Trans>
                  <div
                    className={`actions ${
                      isAdmin || isOwner ? 'edit-save' : ''
                    }`}
                  >
                    {isAuthenticated && !isEditing && (
                      <div
                        className={`bookmark ${bookmarked && 'bookmarked'}`}
                        onClick={toggleBookmark.submitForm}
                      >
                        {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </div>
                    )}
                    {(isAdmin || isOwner) && isEditing && (
                      <PrimaryButton
                        className={`${form.isSubmitting ? 'loading' : ''}`}
                        color="green"
                        onClick={handleOnSaveClick}
                      >
                        <div
                          className="loading"
                          style={{
                            visibility: form.isSubmitting
                              ? 'visible'
                              : 'hidden',
                          }}
                        >
                          <Loading color="white" />
                        </div>
                        <div
                          className="label"
                          style={{
                            visibility: form.isSubmitting
                              ? 'hidden'
                              : 'visible',
                          }}
                        >
                          <SaveIcon />
                        </div>
                      </PrimaryButton>
                    )}
                    {(isAdmin || isOwner) && !isEditing && (
                      <SecondaryButton
                        onClick={handleOnEditClick}
                        color="orange"
                      >
                        <EditIcon />
                      </SecondaryButton>
                    )}
                  </div>
                </div>
                {isOwner ? (
                  <InputTextField
                    className="title underline"
                    name="title"
                    value={form.values.title}
                    displayMode={true}
                    onChange={form.handleChange}
                    edit={isEditing}
                    error={isEditing && shouldShowErrors && form.errors.title}
                  />
                ) : (
                  <div className="title">{form.values.title}</div>
                )}
                {isOwner ? (
                  <InputTextField
                    className="underline"
                    value={form.values.description}
                    name="description"
                    displayMode={true}
                    onChange={form.handleChange}
                    edit={isEditing}
                    error={
                      isEditing && shouldShowErrors && form.errors.description
                    }
                    textAreaAutoSize={true}
                    textarea={true}
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
                          <SecondaryButton onClick={toggleFollow.submitForm}>
                            <Trans>Unfollow</Trans>
                          </SecondaryButton>
                        </div>
                      ) : (
                        <div className="follow-and-followers">
                          <PrimaryButton onClick={toggleFollow.submitForm}>
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
                      <SecondaryButton
                        color="red"
                        onHoverColor="fill-red"
                        onClick={() => setIsToDelete(true)}
                      >
                        <DeleteOutlineIcon />
                      </SecondaryButton>
                    )}
                  </div>
                </div>
              </div>
            </Card>
            <div className="main-content">
              <div className={`main-column`}>
                <ListCard
                  content={resourceCardPropsList.map((resourceCardProps) => {
                    return (
                      <ResourceCard
                        {...resourceCardProps}
                        isEditing={isEditing}
                      />
                    )
                  })}
                  className="resources no-card"
                />
                <div className="collection-footer">
                  <div className="left-column">
                    {(!isOwner || isAdmin) && (
                      <ContributorCard {...contributorCardProps} />
                    )}
                  </div>
                  <div className="right-column">
                    {(isAdmin || isOwner) && extraDetails}
                    {/*actionsCard*/}
                  </div>
                  <div className="one-column">
                    {/*actionsCard*/}
                    {(!isOwner || isAdmin) && (
                      <ContributorCard {...contributorCardProps} />
                    )}
                    {(isAdmin || isOwner) && extraDetails}
                  </div>
                </div>
              </div>
              <div className="side-column">
                {(!isOwner || isAdmin) && (
                  <ContributorCard {...contributorCardProps} />
                )}
                {(isAdmin || isOwner) && extraDetails}
                {/*actionsCard*/}
              </div>
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  }
)
