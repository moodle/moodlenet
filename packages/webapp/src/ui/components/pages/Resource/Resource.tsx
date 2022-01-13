import { t, Trans } from '@lingui/macro'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditIcon from '@material-ui/icons/Edit'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import LinkIcon from '@material-ui/icons/Link'
import SaveIcon from '@material-ui/icons/Save'
import React, { useCallback, useState } from 'react'
import { tagList } from '../../../elements/tags'
import { CP, withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import defaultBackgroud from '../../../static/img/default-background.svg'
import { FollowTag, getResourceColorType } from '../../../types'
import Card from '../../atoms/Card/Card'
import Dropdown from '../../atoms/Dropdown/Dropdown'
import InputTextField from '../../atoms/InputTextField/InputTextField'
import Modal from '../../atoms/Modal/Modal'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import RoundButton from '../../atoms/RoundButton/RoundButton'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import {
  AddToCollectionsCard,
  CollectionItem,
} from '../../molecules/cards/AddToCollectionsCard/AddToCollectionsCard'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import { DropdownField, FormatDropdown } from '../NewResource/FieldsData'
import { NewResourceFormValues } from '../NewResource/types'
import {
  ContributorCard,
  ContributorCardProps,
} from './ContributorCard/ContributorCard'
import './styles.scss'

export type ResourceProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  isAuthenticated: boolean
  isOwner: boolean
  isAdmin: boolean
  title: string
  liked: boolean
  numLikes: number
  bookmarked: boolean
  tags: FollowTag[]
  contributorCardProps: ContributorCardProps
  formBag: FormikBag<NewResourceFormValues>
  types: DropdownField
  levels: DropdownField
  months: DropdownField
  years: DropdownField
  languages: DropdownField
  contentUrl: string
  type: 'link' | 'file'
  // formats: DropdownField
  licenses: DropdownField
  visibility: DropdownField
  categories: DropdownField
  setAddToCollections?: (selectedCollections: CollectionItem[]) => unknown
  collections?: CollectionItem[]
  selectedCollections?: CollectionItem[]
  updateResource: () => unknown
  toggleLike: () => unknown
  toggleBookmark: () => unknown
  deleteResource?: () => unknown
  sendToMoodleLms: (site?: string) => unknown
  lmsSite?: string
}

export const Resource = withCtrl<ResourceProps>(
  ({
    headerPageTemplateProps,
    isAuthenticated,
    isOwner,
    isAdmin,
    liked,
    numLikes,
    bookmarked,
    tags,
    contributorCardProps,
    formBag,
    types,
    levels,
    months,
    years,
    languages,
    // formats,
    licenses,
    visibility,
    categories,
    collections,
    selectedCollections,
    setAddToCollections,
    updateResource,
    toggleLike,
    toggleBookmark,
    deleteResource,
    sendToMoodleLms,
    contentUrl,
    type,
    lmsSite,
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isAddingToCollection, setIsAddingToCollection] =
      useState<boolean>(false)
    const [isAddingToMoodleLms, setIsAddingToMoodleLms] =
      useState<boolean>(false)
    const [isToDelete, setIsToDelete] = useState<boolean>(false)
    const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
    const [moodleLmsSite, setMoodleLmsSite] = useState<string>(lmsSite ?? '')
    //const [isLeaving, setIsLeaving] = useState<boolean>(false)
    //const [hasMadeChanges, setHasMadeChanges] = useState<string>(lmsSite ?? '')

    const handleOnEditClick = () => {
      setIsEditing(true)
    }
    const handleOnSaveClick = () => {
      updateResource()
      setIsEditing(false)
    }

    const [form, formAttrs] = formBag
    const setFieldValue = form.setFieldValue
    const setTitleField = useCallback(
      (_: string) => setFieldValue('title', _),
      [setFieldValue]
    )
    const setDescriptionField = useCallback(
      (_: string) => setFieldValue('description', _),
      [setFieldValue]
    )
    const setTypeField = useCallback(
      (_: string) => setFieldValue('type', _),
      [setFieldValue]
    )
    const setLevelField = useCallback(
      (_: string) => setFieldValue('level', _),
      [setFieldValue]
    )
    const setMonthField = useCallback(
      (_: string) => setFieldValue('originalDateMonth', _),
      [setFieldValue]
    )
    const setYearField = useCallback(
      (_: string) => setFieldValue('originalDateYear', _),
      [setFieldValue]
    )
    const setLangField = useCallback(
      (_: string) => setFieldValue('language', _),
      [setFieldValue]
    )
    const setCategoryField = useCallback(
      (_: string) => setFieldValue('category', _),
      [setFieldValue]
    )
    const setLicenseField = useCallback(
      (_: string) => setFieldValue('license', _),
      [setFieldValue]
    )
    const setVisibilityField = useCallback(
      (_: string) => setFieldValue('visibility', _),
      [setFieldValue]
    )
    //const setCollectionsField = useCallback((_: string) => setFieldValue('collections', _), [setFieldValue])
    // console.log({ selectedCollections, collections })

    const selectImage = () => {
      document.getElementById('upload-image')?.click()
    }

    const uploadImage = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e?.currentTarget.files?.item(0)
        selectedFile && setFieldValue('image', selectedFile)
      },
      [setFieldValue]
    )

    const image = (
      <img
        className="image"
        src={
          typeof form.values.imageUrl === 'string'
            ? form.values.imageUrl
            : defaultBackgroud
        }
        alt="Background"
        {...(type === 'file' && { onClick: () => setIsShowingImage(true) })}
      />
    )

    const actions = (
      <Card className="resource-action-card" hideBorderWhenSmall={true}>
        <PrimaryButton onClick={() => setIsAddingToMoodleLms(true)}>
          <Trans>Send to Moodle</Trans>
        </PrimaryButton>
        {isAuthenticated && (
          <SecondaryButton onClick={() => setIsAddingToCollection(true)}>
            <Trans>Add to Collection</Trans>
          </SecondaryButton>
        )}
        <a
          href={contentUrl}
          target="_blank"
          rel="noreferrer"
          download={form.values.title}
        >
          <SecondaryButton>
            {type === 'file' ? (
              <>
                <InsertDriveFileIcon />
                <Trans>Download File</Trans>
              </>
            ) : (
              <>
                <LinkIcon />
                <Trans>Open Link</Trans>
              </>
            )}
          </SecondaryButton>
        </a>
      </Card>
    )

    const extraDetails = isEditing ? (
      <Card className="extra-details-card" hideBorderWhenSmall={true}>
        <Dropdown
          value={form.values.visibility}
          {...visibility}
          {...formAttrs.visibility}
          displayMode={true}
          edit={isEditing}
          getValue={setVisibilityField}
        />
        <Dropdown
          value={form.values.category}
          {...categories}
          {...formAttrs.category}
          displayMode={true}
          edit={isEditing}
          getValue={setCategoryField}
        />
        <Dropdown
          value={form.values.license}
          {...licenses}
          {...formAttrs.license}
          displayMode={true}
          edit={isEditing}
          getValue={setLicenseField}
        />
        <Dropdown
          value={form.values.type}
          {...types}
          {...formAttrs.type}
          displayMode={true}
          edit={isEditing}
          getValue={setTypeField}
        />
        <Dropdown
          value={form.values.level}
          {...levels}
          {...formAttrs.level}
          displayMode={true}
          edit={isEditing}
          getValue={setLevelField}
        />
        <div className="date">
          <label>
            <Trans>Original creation date</Trans>
          </label>
          <div className="fields">
            <Dropdown
              value={form.values.originalDateMonth}
              {...months}
              {...formAttrs.originalDateMonth}
              displayMode={true}
              edit={isEditing}
              getValue={setMonthField}
            />
            <Dropdown
              value={form.values.originalDateYear}
              {...years}
              {...formAttrs.originalDateYear}
              displayMode={true}
              edit={isEditing}
              getValue={setYearField}
            />
          </div>
        </div>
        <Dropdown
          value={form.values.language}
          {...languages}
          {...formAttrs.language}
          displayMode={true}
          edit={isEditing}
          getValue={setLangField}
        />
        <Dropdown
          value={form.values.format}
          {...FormatDropdown}
          {...formAttrs.format}
          displayMode={true}
          edit={false}
        />
      </Card>
    ) : (
      <Card className="extra-details-card" hideBorderWhenSmall={true}>
        {(isAdmin || isOwner) && (
          <div className="detail">
            <div className="title">
              <Trans>Visibility</Trans>
            </div>
            <abbr className="value">{form.values.visibility}</abbr>
          </div>
        )}
        <div className="detail">
          <div className="title">
            <Trans>Subject</Trans>
          </div>
          <abbr className="value">{form.values.category}</abbr>
        </div>
        {form.values.license && (
          <div className="detail">
            <div className="title">
              <Trans>License</Trans>
            </div>
            <abbr className="value" title={form.values.license}>
              {form.values.license}
            </abbr>
          </div>
        )}
        {form.values.type && (
          <div className="detail">
            <div className="title">
              <Trans>Type</Trans>
            </div>
            <abbr className="value" title={form.values.type}>
              {form.values.type}
            </abbr>
          </div>
        )}
        {form.values.level && (
          <div className="detail">
            <div className="title">
              <Trans>Level</Trans>
            </div>
            <abbr className="value" title={form.values.level}>
              {form.values.level}
            </abbr>
          </div>
        )}
        {(form.values.originalDateMonth || form.values.originalDateYear) && (
          <div className="detail">
            <div className="title">
              <Trans>Original creation date</Trans>
            </div>
            <abbr
              className="value date"
              title={`${form.values.originalDateMonth} ${form.values.originalDateYear}`}
            >
              <span>{form.values.originalDateMonth}</span>
              <span>{form.values.originalDateYear}</span>
            </abbr>
          </div>
        )}
        {form.values.language && (
          <div className="detail">
            <div className="title">
              <Trans>Language</Trans>
            </div>
            <abbr className="value" title={form.values.language}>
              {form.values.language}
            </abbr>
          </div>
        )}
        {form.values.format && (
          <div className="detail">
            <div className="title">
              <Trans>Format</Trans>
            </div>
            <abbr className="value" title={form.values.format}>
              {form.values.format}
            </abbr>
          </div>
        )}
      </Card>
    )

    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        {/* {isLeaving && hasMadeChanges && (
          <Modal
            title={t`Discard changes`}
            actions={[
              <SecondaryButton
                onClick={() => {
                }}
              >
                <Trans>Cancel</Trans>
              </SecondaryButton>,
              <PrimaryButton
                onClick={() => {
                }}
              >
                <Trans>Discard</Trans>
              </PrimaryButton>,
            ]}
            onClose={() => setIsAddingToMoodleLms(false)}
            style={{ maxWidth: '350px', width: '100%' }}
          >
            <Trans>Are you sure you want to discard the changes you made?</Trans>
          </Modal>
        )} */}
        {isShowingImage && typeof form.values.imageUrl === 'string' && (
          <Modal
            className="image-modal"
            closeButton={false}
            onClose={() => setIsShowingImage(false)}
            style={{ maxWidth: '90%', maxHeight: '90%' }}
          >
            <img src={form.values.imageUrl} alt="Resource" />
          </Modal>
        )}
        {isAddingToCollection && collections && setAddToCollections && (
          <Modal
            title={t`Select Collections`}
            actions={[
              <PrimaryButton>
                <Trans>Done</Trans>
              </PrimaryButton>,
            ]}
            onClose={() => setIsAddingToCollection(false)}
            style={{ maxWidth: '400px' }}
          >
            {console.log(formAttrs.collections)}
            <AddToCollectionsCard
              allCollections={collections}
              setAddToCollections={setAddToCollections}
              header={false}
              noCard={true}
            />
          </Modal>
        )}
        {isAddingToMoodleLms && (
          <Modal
            title={t`Your Moodle LMS Site`}
            actions={[
              <PrimaryButton
                onClick={() => {
                  sendToMoodleLms(moodleLmsSite)
                  setIsAddingToMoodleLms(false)
                }}
              >
                <Trans>Send</Trans>
              </PrimaryButton>,
            ]}
            onClose={() => setIsAddingToMoodleLms(false)}
            style={{ maxWidth: '350px', width: '100%' }}
          >
            {console.log(formAttrs.collections)}
            <InputTextField
              placeholder="http://your-moodle-lms-site.com"
              value={moodleLmsSite}
              getText={setMoodleLmsSite}
              autoUpdate
            />
          </Modal>
        )}
        {isToDelete && deleteResource && (
          <Modal
            title={t`Alert`}
            actions={[
              <PrimaryButton
                onClick={() => {
                  deleteResource()
                  setIsToDelete(false)
                }}
                color="red"
              >
                <Trans>Delete</Trans>
              </PrimaryButton>,
            ]}
            onClose={() => setIsToDelete(false)}
            style={{ maxWidth: '400px' }}
            className="delete-message"
          >
            <Trans>The resource will be deleted</Trans>
          </Modal>
        )}
        <div className="resource">
          {isAddingToCollection && collections && setAddToCollections && (
            <Modal
              title={t`Select Collections`}
              actions={[
                <PrimaryButton onClick={() => setIsAddingToCollection(false)}>
                  Done
                </PrimaryButton>,
              ]}
              onClose={() => setIsAddingToCollection(false)}
              style={{ maxWidth: '400px' }}
            >
              <AddToCollectionsCard
                allCollections={collections}
                setAddToCollections={setAddToCollections}
                header={false}
                noCard={true}
                value={selectedCollections}
              />
            </Modal>
          )}
          <div className="content">
            <div className="main-column">
              <Card className="main-resource-card" hideBorderWhenSmall={true}>
                <div className="resource-header">
                  <div className="type-and-actions">
                    <span className="type">
                      <Trans>Resource</Trans>
                      <div
                        style={{
                          color: getResourceColorType(
                            form.values.type
                              ? form.values.type
                              : form.values.contentType
                          ),
                        }}
                      >
                        &nbsp;/{' '}
                        {form.values.type
                          ? form.values.type
                          : form.values.contentType}
                      </div>
                    </span>
                    <div className="actions">
                      {!isEditing && (
                        <div
                          className={`${
                            isAuthenticated && !isOwner
                              ? 'like'
                              : 'like-disabled'
                          } ${liked && 'liked'}`}
                          onClick={
                            isAuthenticated && !isOwner ? toggleLike : () => {}
                          }
                        >
                          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                          <span>{numLikes}</span>
                        </div>
                      )}
                      {isAuthenticated && !isEditing && (
                        <div
                          className={`bookmark ${bookmarked && 'bookmarked'}`}
                          onClick={toggleBookmark}
                        >
                          {bookmarked ? (
                            <BookmarkIcon />
                          ) : (
                            <BookmarkBorderIcon />
                          )}
                        </div>
                      )}
                      {/*<div className="share">
                        <ShareIcon />
                      </div>*/}
                      {(isAdmin || isOwner) && (
                        <div className="edit-save">
                          {isEditing ? (
                            <PrimaryButton
                              color="green"
                              onHoverColor="orange"
                              onClick={handleOnSaveClick}
                            >
                              <SaveIcon />
                            </PrimaryButton>
                          ) : (
                            <SecondaryButton
                              onClick={handleOnEditClick}
                              color="orange"
                            >
                              <EditIcon />
                            </SecondaryButton>
                          )}
                        </div>
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
                  {tags.length > 0 && (
                    <div className="tags scroll">{tagList(tags, 'medium')}</div>
                  )}
                </div>
                {(typeof form.values.imageUrl === 'string' || isEditing) && (
                  <div className="image-container">
                    {type === 'link' ? (
                      <a href={contentUrl} target="_blank" rel="noreferrer">
                        {image}
                      </a>
                    ) : (
                      image
                    )}

                    {isEditing && (
                      <input
                        id="upload-image"
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
                <div className="bottom">
                  {isEditing && (
                    <SecondaryButton
                      color="red"
                      onHoverColor="filled-red"
                      onClick={() => setIsToDelete(true)}
                    >
                      <DeleteOutlineIcon />
                    </SecondaryButton>
                  )}
                </div>
                {/* <div className="comments"></div> */}
              </Card>
              <div className="resource-footer">
                <div className="left-column">
                  {(!isOwner || isAdmin) && (
                    <ContributorCard {...contributorCardProps} />
                  )}
                  {actions}
                </div>
                <div className="right-column">{extraDetails}</div>
                <div className="one-column">
                  {(!isOwner || isAdmin) && (
                    <ContributorCard {...contributorCardProps} />
                  )}
                  {actions}
                  {extraDetails}
                </div>
              </div>
            </div>
            <div className="side-column">
              {(!isOwner || isAdmin) && (
                <ContributorCard {...contributorCardProps} />
              )}
              {actions}
              {extraDetails}
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  }
)
