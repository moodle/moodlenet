import { t, Trans } from '@lingui/macro'
import { default as BookmarkBorderIcon, default as BookmarkIcon } from '@material-ui/icons/BookmarkBorder'
import EditIcon from '@material-ui/icons/Edit'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import LinkIcon from '@material-ui/icons/Link'
import SaveIcon from '@material-ui/icons/Save'
import ShareIcon from '@material-ui/icons/Share'
import { useCallback, useState } from 'react'
import Card from '../../components/atoms/Card/Card'
import Dropdown from '../../components/atoms/Dropdown/Dropdown'
import InputTextField from '../../components/atoms/InputTextField/InputTextField'
import Modal from '../../components/atoms/Modal/Modal'
import PrimaryButton from '../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton'
import { AddToCollectionsCard, CollectionItem } from '../../components/cards/AddToCollectionsCard/AddToCollectionsCard'
import { CP, withCtrl } from '../../lib/ctrl'
import { FormikBag } from '../../lib/formik'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { getResourceColorType } from '../../types'
import { DropdownField, FormatDropdown } from '../NewResource/FieldsData'
import { NewResourceFormValues } from '../NewResource/types'
import { ContributorCard, ContributorCardProps } from './ContributorCard/ContributorCard'
import './styles.scss'

export type ResourceProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  isAuthenticated: boolean
  isOwner: boolean
  title: string
  liked: boolean
  numLikes: number
  bookmarked: boolean
  tags: Array<string>
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
  categories: DropdownField
  setAddToCollections?: (selectedCollections: CollectionItem[]) => unknown
  collections?: CollectionItem[]
  selectedCollections?: CollectionItem[]
  updateResource: () => unknown
  toggleLike: () => unknown
  toggleBookmark: () => unknown
  deleteResource?: () => unknown
  sendToMoodleLms?: (site?: string) => unknown
}

export const Resource = withCtrl<ResourceProps>(
  ({
    headerPageTemplateProps,
    isAuthenticated,
    isOwner,
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
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isAddingToCollection, setIsAddingToCollection] = useState<boolean>(false)
    const [isAddingToMoodleLms, setIsAddingToMoodleLms] = useState<boolean>(false)
    const [moodleLmsSite, setMoodleLmsSite] = useState<string>('')

    const handleOnEditClick = () => {
      setIsEditing(true)
    }
    const handleOnSaveClick = () => {
      updateResource()
      setIsEditing(false)
    }

    const tagSet = tags.map((value: string, index: number) => {
      return (
        <div key={index} className="tag">
          {value}
        </div>
      )
    })

    const actions = (
      <Card className="resource-action-card" hideBorderWhenSmall={true}>
        <PrimaryButton disabled={!isAuthenticated || !sendToMoodleLms} onClick={() => setIsAddingToMoodleLms(true)}>
          <Trans>Send to Moodle</Trans>
        </PrimaryButton>
        <SecondaryButton disabled={!isAuthenticated} onClick={() => setIsAddingToCollection(true)}>
          <Trans>Add to Collection</Trans>
        </SecondaryButton>
        <a href={contentUrl} target="_blank" rel="noreferrer">
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

    const [form, formAttrs] = formBag
    const setFieldValue = form.setFieldValue
    const setTitleField = useCallback((_: string) => setFieldValue('title', _), [setFieldValue])
    const setDescriptionField = useCallback((_: string) => setFieldValue('description', _), [setFieldValue])
    const setTypeField = useCallback((_: string) => setFieldValue('type', _), [setFieldValue])
    const setLevelField = useCallback((_: string) => setFieldValue('level', _), [setFieldValue])
    const setMonthField = useCallback((_: string) => setFieldValue('originalDateMonth', _), [setFieldValue])
    const setYearField = useCallback((_: string) => setFieldValue('originalDateYear', _), [setFieldValue])
    const setLangField = useCallback((_: string) => setFieldValue('language', _), [setFieldValue])
    const setCategoryField = useCallback((_: string) => setFieldValue('category', _), [setFieldValue])
    const setLicenseField = useCallback((_: string) => setFieldValue('license', _), [setFieldValue])
    //const setCollectionsField = useCallback((_: string) => setFieldValue('collections', _), [setFieldValue])
    console.log({ selectedCollections, collections })
    const extraDetails = (
      <Card className="extra-details-card" hideBorderWhenSmall={true}>
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
            <Trans>Original Creation Date</Trans>
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
        {isEditing && (
          <SecondaryButton color="red" onHoverColor="filled-red" onClick={deleteResource}>
            <Trans>Delete Resource</Trans>
          </SecondaryButton>
        )}
      </Card>
    )
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        {isAddingToCollection && collections && setAddToCollections && (
          <Modal
            title={t`Select Collections`}
            actions={
              <PrimaryButton>
                <Trans>Done</Trans>
              </PrimaryButton>
            }
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
        {isAddingToMoodleLms && sendToMoodleLms && (
          <Modal
            title={t`Your Moodle LMS Site`}
            actions={
              <PrimaryButton
                onClick={() => {
                  sendToMoodleLms(moodleLmsSite)
                  setIsAddingToMoodleLms(false)
                }}
              >
                <Trans>Send</Trans>
              </PrimaryButton>
            }
            onClose={() => setIsAddingToMoodleLms(false)}
            style={{ maxWidth: '350px', width: '100%' }}
          >
            {console.log(formAttrs.collections)}
            <InputTextField
              placeholder="http://your-moodle-lms-site.com"
              value={moodleLmsSite}
              getText={setMoodleLmsSite}
            />
          </Modal>
        )}
        <div className="resource">
          {isAddingToCollection && collections && setAddToCollections && (
            <Modal
              title={t`Select Collections`}
              actions={<PrimaryButton onClick={() => setIsAddingToCollection(false)}>Done</PrimaryButton>}
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
                          color: getResourceColorType(form.values.type ? form.values.type : form.values.contentType),
                        }}
                      >
                        &nbsp;/ {form.values.type ? form.values.type : form.values.contentType}
                      </div>
                    </span>
                    <div className="actions">
                      <div
                        className={`${isAuthenticated ? 'like' : 'not-authentificated'} ${liked && 'liked'}`}
                        onClick={isAuthenticated ? toggleLike : () => {}}
                      >
                        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        <span>{numLikes}</span>
                      </div>
                      {!isOwner && isAuthenticated && (
                        <div className={`bookmark ${bookmarked && 'bookmarked'}`} onClick={toggleBookmark}>
                          {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </div>
                      )}
                      <div className="share">
                        <ShareIcon />
                      </div>
                      {isOwner && (
                        <div className="edit-save">
                          {isEditing ? (
                            <PrimaryButton color="green" onHoverColor="orange" onClick={handleOnSaveClick}>
                              <SaveIcon />
                            </PrimaryButton>
                          ) : (
                            <SecondaryButton onClick={handleOnEditClick} color="orange">
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
                  {tagSet.length > 0 && <div className="tags scroll">{tagSet}</div>}
                </div>
                <img
                  className="image"
                  src={typeof form.values.image === 'string' ? form.values.image : ''}
                  alt="Background"
                />
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
                {/* <div className="comments"></div> */}
              </Card>
              <div className="resource-footer">
                <div className="left-column">
                  {!isOwner && <ContributorCard {...contributorCardProps} />}
                  {actions}
                </div>
                <div className="right-column">{extraDetails}</div>
                <div className="one-column">
                  {!isOwner && <ContributorCard {...contributorCardProps} />}
                  {actions}
                  {extraDetails}
                </div>
              </div>
            </div>
            <div className="side-column">
              {!isOwner && <ContributorCard {...contributorCardProps} />}
              {actions}
              {extraDetails}
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)
