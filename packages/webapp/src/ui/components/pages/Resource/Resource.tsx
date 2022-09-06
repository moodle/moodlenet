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
import FlagIcon from '@mui/icons-material/Flag'
import ShareIcon from '@mui/icons-material/Share'
import React, { useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { getBackupImage } from '../../../../helpers/utilities'
import { getTagList } from '../../../elements/tags'
import { CP, withCtrl } from '../../../lib/ctrl'
import { FormikHandle } from '../../../lib/formik'
import { SelectOptions, SelectOptionsMulti } from '../../../lib/types'
import { useImageUrl } from '../../../lib/useImageUrl'
import { AssetInfo, FollowTag, getResourceTypeInfo } from '../../../types'
import Card from '../../atoms/Card/Card'
import {
  Dropdown,
  IconPill,
  IconTextOption,
  IconTextOptionProps,
  SimplePill,
  TextOption,
  TextOptionProps,
} from '../../atoms/Dropdown/Dropdown'
import FloatingMenu from '../../atoms/FloatingMenu/FloatingMenu'
import { InputTextField } from '../../atoms/InputTextField/InputTextField'
import Loading from '../../atoms/Loading/Loading'
import Modal from '../../atoms/Modal/Modal'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import RoundButton from '../../atoms/RoundButton/RoundButton'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import Snackbar from '../../atoms/Snackbar/Snackbar'
import TertiaryButton from '../../atoms/TertiaryButton/TertiaryButton'
import {
  VisibilityDropdown,
  VisibilityNodes,
} from '../../atoms/VisibilityDropdown/VisibilityDropdown'
import {
  AddToCollectionsCard,
  OptionItem,
  OptionItemProp,
} from '../../molecules/cards/AddToCollectionsCard/AddToCollectionsCard'
import ReportModal from '../../molecules/modals/ReportModal/ReportModal'
import SearchImage from '../../organisms/SearchImage/SearchImage'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import { MonthTextOptionProps, YearsProps } from '../NewResource/FieldsData'
import { NewResourceFormValues } from '../NewResource/types'
import {
  ContributorCard,
  ContributorCardProps,
} from './ContributorCard/ContributorCard'
import './styles.scss'

export type ResourceFormValues = Omit<
  NewResourceFormValues,
  'addToCollections' | 'content'
> & { isFile: boolean }
export type ResourceProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  resourceId: string
  resourceUrl: string
  isAuthenticated: boolean
  isOwner: boolean
  isAdmin: boolean
  autoImageAdded: boolean
  canSearchImage: boolean
  numLikes: number
  collections: SelectOptionsMulti<OptionItemProp>
  liked: boolean
  bookmarked: boolean
  tags: FollowTag[]
  contributorCardProps: ContributorCardProps
  form: FormikHandle<Omit<ResourceFormValues, 'addToCollections'>>
  contentUrl: string
  toggleLikeForm: FormikHandle
  toggleBookmarkForm: FormikHandle
  deleteResourceForm?: FormikHandle
  addToCollectionsForm: FormikHandle<{ collections: string[] }>
  sendToMoodleLmsForm: FormikHandle<{ site?: string }>
  reportForm?: FormikHandle<{ comment: string }>
  resourceFormat: string
  contentType: 'link' | 'file'

  licenses: SelectOptions<IconTextOptionProps>
  setCategoryFilter(text: string): unknown
  categories: SelectOptions<TextOptionProps>
  setTypeFilter(text: string): unknown
  types: SelectOptions<TextOptionProps>
  setLevelFilter(text: string): unknown
  levels: SelectOptions<TextOptionProps>
  setLanguageFilter(text: string): unknown
  languages: SelectOptions<TextOptionProps>
  downloadFilename: string
  type: string
}
export const Resource = withCtrl<ResourceProps>(
  ({
    headerPageTemplateProps,
    resourceId,
    resourceUrl,
    isAuthenticated,
    isOwner,
    isAdmin,
    liked,
    numLikes,
    bookmarked,
    tags,
    contributorCardProps,
    types,
    levels,
    languages,
    licenses,
    categories,
    collections,
    form,
    reportForm,
    toggleLikeForm,
    toggleBookmarkForm,
    deleteResourceForm,
    sendToMoodleLmsForm,
    contentUrl,
    // resourceFormat,
    contentType,
    addToCollectionsForm,
    autoImageAdded,
    canSearchImage,
    setCategoryFilter,
    setLanguageFilter,
    setLevelFilter,
    setTypeFilter,
    downloadFilename,
    type,
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(
      canSearchImage && autoImageAdded
    )
    const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
    const [isSearchingImage, setIsSearchingImage] = useState<boolean>(false)
    const [shouldShowSendToMoodleLmsError, setShouldShowSendToMoodleLmsError] =
      useState<boolean>(false)
    const [isAddingToCollection, setIsAddingToCollection] =
      useState<boolean>(false)
    const [isAddingToMoodleLms, setIsAddingToMoodleLms] =
      useState<boolean>(false)
    const [isToDelete, setIsToDelete] = useState<boolean>(false)
    const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
    const backupImage: AssetInfo | null | undefined = useMemo(
      () => getBackupImage(resourceId),
      [resourceId]
    )
    const [isReporting, setIsReporting] = useState<boolean>(false)
    const [showReportedAlert, setShowReportedAlert] = useState<boolean>(false)
    const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)

    const [imageUrl] = useImageUrl(
      form.values?.image?.location,
      backupImage?.location
    )

    const { typeName, typeColor } = getResourceTypeInfo(type)

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

    const copyUrl = () => {
      navigator.clipboard.writeText(resourceUrl)
      setShowUrlCopiedAlert(false)
      setTimeout(() => {
        setShowUrlCopiedAlert(true)
      }, 100)
    }

    const handleOnSendToMoodleClick = () => {
      if (sendToMoodleLmsForm.isValid) {
        sendToMoodleLmsForm.submitForm()
        setIsAddingToMoodleLms(false)
        setShouldShowSendToMoodleLmsError(false)
      } else {
        setShouldShowSendToMoodleLmsError(true)
      }
    }

    const shouldShowExtraDetails =
      form.values.visibility ||
      licenses.selected ||
      types.selected ||
      levels.selected ||
      form.values.month ||
      form.values.year ||
      languages.selected

    const uploadImageRef = useRef<HTMLInputElement>(null)
    const selectImage = () => {
      uploadImageRef.current?.click()
    }

    const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.currentTarget.files?.item(0)
      if (selectedFile) {
        form.setFieldValue('image', { location: selectedFile })
      }
    }

    const setImage = (image: AssetInfo | undefined) => {
      form.setFieldValue('image', image)
    }

    const deleteImage = () => {
      form.setFieldValue('image', null)
    }

    const imageDiv = (
      <img
        className="image"
        src={imageUrl}
        alt="Background"
        {...(contentType === 'file' && {
          onClick: () => setIsShowingImage(true),
        })}
        style={{ maxHeight: form.values.image ? 'fit-content' : '150px' }}
      />
    )

    const getImageCredits = (image: AssetInfo | undefined | null) => {
      const credits = image
        ? image.credits
          ? image.credits
          : undefined
        : backupImage?.credits
      return (
        credits && (
          <div className="image-credits">
            Photo by
            <a href={credits.owner.url} target="_blank" rel="noreferrer">
              {credits.owner.name}
            </a>
            on
            {
              <a href={credits.owner.url} target="_blank" rel="noreferrer">
                {credits.provider?.name}
              </a>
            }
          </div>
        )
      )
    }

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
          download={downloadFilename}
        >
          <SecondaryButton>
            {contentType === 'file' ? (
              <>
                <InsertDriveFileIcon />
                <Trans>Download File</Trans>
              </>
            ) : (
              <>
                <LinkIcon />
                <Trans>Open link</Trans>
              </>
            )}
          </SecondaryButton>
        </a>
      </Card>
    )

    const extraDetails = isEditing ? (
      <Card className="extra-details-card" hideBorderWhenSmall={true}>
        <VisibilityDropdown
          name="visibility"
          value={form.values.visibility}
          onChange={form.handleChange}
          disabled={form.isSubmitting}
          edit={isEditing}
          label="Visibility"
          highlight={shouldShowErrors && !!form.errors.visibility}
          error={form.errors.visibility}
          position={{ top: 50, bottom: 25 }}
        />
        <Dropdown
          name="category"
          value={form.values.category}
          onChange={form.handleChange}
          label="Subject"
          disabled={form.isSubmitting}
          edit={isEditing}
          highlight={shouldShowErrors && !!form.errors.category}
          error={form.errors.category}
          position={{ top: 50, bottom: 25 }}
          searchByText={setCategoryFilter}
          pills={
            categories.selected && (
              <SimplePill
                key={categories.selected.value}
                value={categories.selected.value}
                label={categories.selected.label}
              />
            )
          }
        >
          {categories.selected && (
            <TextOption
              key={categories.selected.value}
              value={categories.selected.value}
              label={categories.selected.label}
            />
          )}
          {categories.opts.map(
            ({ label, value }) =>
              categories.selected?.value !== value && (
                <TextOption key={value} label={label} value={value} />
              )
          )}
        </Dropdown>
        {contentType === 'file' && (
          <Dropdown
            name="license"
            className="license-dropdown"
            onChange={form.handleChange}
            value={form.values.license}
            label={t`License`}
            edit
            highlight={shouldShowErrors && !!form.errors.license}
            disabled={form.isSubmitting}
            error={form.errors.license}
            position={{ top: 50, bottom: 25 }}
            pills={
              licenses.selected && (
                <IconPill
                  key={licenses.selected.value}
                  icon={licenses.selected.icon}
                />
              )
            }
          >
            {licenses.opts.map(({ icon, label, value }) => (
              <IconTextOption
                icon={icon}
                label={label}
                value={value}
                key={value}
              />
            ))}
          </Dropdown>
        )}
        <Dropdown
          name="type"
          label={t`Type`}
          value={form.values.type}
          onChange={form.handleChange}
          edit
          position={{ top: 50, bottom: 25 }}
          disabled={form.isSubmitting}
          error={form.errors.type}
          searchByText={setTypeFilter}
          pills={
            types.selected && (
              <SimplePill
                label={types.selected.label}
                value={types.selected.value}
              />
            )
          }
        >
          {types.selected && (
            <TextOption
              key={types.selected.value}
              value={types.selected.value}
              label={types.selected.label}
            />
          )}
          {types.opts.map(
            ({ label, value }) =>
              types.selected?.value !== value && (
                <TextOption key={value} label={label} value={value} />
              )
          )}
        </Dropdown>
        <Dropdown
          name="level"
          label={t`Level`}
          value={form.values.level}
          onChange={form.handleChange}
          edit
          position={{ top: 50, bottom: 25 }}
          searchByText={setLevelFilter}
          disabled={form.isSubmitting}
          error={form.errors.level}
          pills={
            levels.selected && (
              <SimplePill
                label={levels.selected.label}
                value={levels.selected.value}
              />
            )
          }
        >
          {levels.selected && (
            <TextOption
              key={levels.selected.value}
              value={levels.selected.value}
              label={levels.selected.label}
            />
          )}
          {levels.opts.map(
            ({ label, value }) =>
              levels.selected?.value !== value && (
                <TextOption key={value} label={label} value={value} />
              )
          )}
        </Dropdown>{' '}
        <div className={`date ${form.isSubmitting ? 'disabled' : ''}`}>
          <label>
            <Trans>Original creation date</Trans>
          </label>
          <div className="fields">
            <Dropdown
              name="month"
              onChange={form.handleChange}
              label=""
              value={form.values.month}
              disabled={form.isSubmitting}
              error={form.errors.month}
              edit
              position={{ top: 25, bottom: 25 }}
              pills={
                form.values.month && (
                  <SimplePill
                    label={
                      MonthTextOptionProps.find(
                        ({ value }) => value === form.values.month
                      )!.label
                    }
                    value={form.values.month}
                  />
                )
              }
            >
              {MonthTextOptionProps.map(({ label, value }) => (
                <TextOption key={value} label={label} value={value} />
              ))}
            </Dropdown>
            <Dropdown
              name="year"
              label=""
              onChange={form.handleChange}
              value={form.values.year}
              disabled={form.isSubmitting}
              error={form.errors.year}
              edit
              position={{ top: 25, bottom: 25 }}
              pills={
                form.values.year && (
                  <SimplePill
                    label={form.values.year}
                    value={form.values.year}
                  />
                )
              }
            >
              {YearsProps.map((year) => (
                <TextOption key={year} label={year} value={year} />
              ))}
            </Dropdown>
          </div>
        </div>
        <Dropdown
          name="language"
          label={t`Language`}
          value={form.values.language}
          onChange={form.handleChange}
          edit
          disabled={form.isSubmitting}
          error={form.errors.language}
          position={{ top: 50, bottom: 25 }}
          searchByText={setLanguageFilter}
          pills={
            languages.selected && (
              <SimplePill
                label={languages.selected.label}
                value={languages.selected.value}
              />
            )
          }
        >
          {languages.selected && (
            <TextOption
              key={languages.selected.value}
              value={languages.selected.value}
              label={languages.selected.label}
            />
          )}
          {languages.opts.map(
            ({ label, value }) =>
              languages.selected?.value !== value && (
                <TextOption key={value} label={label} value={value} />
              )
          )}
        </Dropdown>
        {/* <Dropdown
          name="format"
          label={t`Format`}
          defaultValue={resourceFormat}
          disabled
          position={{ top: 50, bottom: 25 }}
          pills={<SimplePill label={resourceFormat} value={resourceFormat} />}
        ></Dropdown> */}
      </Card>
    ) : (
      shouldShowExtraDetails && (
        <Card className="extra-details-card" hideBorderWhenSmall={true}>
          {(isAdmin || isOwner) && (
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
          {isOwner && (
            <div className="detail subject">
              <div className="title">
                <Trans>Subject</Trans>
              </div>
              <abbr className="value">{categories.selected?.label}</abbr>
            </div>
          )}
          {licenses.selected && (
            <div className="detail license">
              <div className="title">
                <Trans>License</Trans>
              </div>
              <abbr className="value icons" title={licenses.selected.label}>
                {licenses.selected.icon}
              </abbr>
            </div>
          )}
          {types.selected && (
            <div className="detail">
              <div className="title">
                <Trans>Type</Trans>
              </div>
              <abbr className="value" title={types.selected.label}>
                {types.selected.label}
              </abbr>
            </div>
          )}
          {levels.selected && (
            <div className="detail">
              <div className="title">
                <Trans>Level</Trans>
              </div>
              <abbr className="value" title={levels.selected.label}>
                {levels.selected.label}
              </abbr>
            </div>
          )}
          {(form.values.month || form.values.year) && (
            <div className="detail">
              <div className="title">
                <Trans>Original creation date</Trans>
              </div>
              <abbr
                className={`value date`}
                title={`${
                  MonthTextOptionProps.find(
                    ({ value }) => value === form.values.month
                  )?.label ?? ''
                } ${form.values.year ?? ''}`}
              >
                <span>
                  {MonthTextOptionProps.find(
                    ({ value }) => value === form.values.month
                  )?.label ?? ''}
                </span>
                <span>{form.values.year ?? ''}</span>
              </abbr>
            </div>
          )}
          {languages.selected && (
            <div className="detail">
              <div className="title">
                <Trans>Language</Trans>
              </div>
              <abbr className="value" title={languages.selected.label}>
                {languages.selected.label}
              </abbr>
            </div>
          )}
          {/* {resourceFormat && (
          <div className="detail">
            <div className="title">
              <Trans>Format</Trans>
            </div>
            <abbr className="value" title={resourceFormat}>
              {resourceFormat}
            </abbr>
          </div>
        )} */}
        </Card>
      )
    )

    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <Helmet>
          <meta property="og:title" content={form.values.name?.slice(0, 90)} />
          <meta
            property="og:description"
            content={form.values.description?.slice(0, 300)}
          />
          {imageUrl && <meta property="og:image" content={imageUrl} />}
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:image" content={imageUrl} />
        </Helmet>
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
        {isReporting && reportForm && (
          <ReportModal
            reportForm={reportForm}
            title={`${t`Confirm reporting this collection`}`}
            setIsReporting={setIsReporting}
            setShowReportedAlert={setShowReportedAlert}
          />
        )}
        {isSearchingImage && (
          <SearchImage
            onClose={() => setIsSearchingImage(false)}
            setImage={setImage}
          />
        )}
        {isShowingImage && imageUrl && (
          <Modal
            className="image-modal"
            closeButton={false}
            onClose={() => setIsShowingImage(false)}
            style={{
              maxWidth: '90%',
              maxHeight: form.values.type !== '' ? 'calc(90% + 20px)' : '90%',
            }}
          >
            <img src={imageUrl} alt="Resource" />
            {getImageCredits(form.values.image)}
          </Modal>
        )}
        {
          //FIXME: there are two identical Modal for `Select Collections` ( look down )
          isAddingToCollection && collections && (
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
              <AddToCollectionsCard
                header={false}
                noCard={true}
                multiple
                name="addToCollections"
                onChange={form.handleChange}
                value={collections.selected.map(({ value }) => value)}
              >
                {collections.opts.map(({ label, value }) => (
                  <OptionItem key={value} label={label} value={value} />
                ))}
              </AddToCollectionsCard>
            </Modal>
          )
        }
        {isAddingToMoodleLms && (
          <Modal
            title={t`Your Moodle LMS Site`}
            actions={
              <PrimaryButton
                onClick={() => {
                  handleOnSendToMoodleClick()
                }}
              >
                <Trans>Send</Trans>
              </PrimaryButton>
            }
            onClose={() => {
              setIsAddingToMoodleLms(false)
              setShouldShowSendToMoodleLmsError(false)
            }}
            style={{ maxWidth: '350px', width: '100%' }}
          >
            <InputTextField
              placeholder="http://your-moodle-lms-site.com"
              value={sendToMoodleLmsForm.values.site}
              name="site"
              edit
              onChange={sendToMoodleLmsForm.handleChange}
              disabled={form.isSubmitting}
              error={
                shouldShowSendToMoodleLmsError &&
                sendToMoodleLmsForm.errors.site
              }
            />
          </Modal>
        )}
        {isToDelete && deleteResourceForm && (
          <Modal
            title={t`Alert`}
            actions={
              <PrimaryButton
                onClick={() => {
                  deleteResourceForm.submitForm()
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
            <Trans>The resource will be deleted</Trans>
          </Modal>
        )}
        {canSearchImage && autoImageAdded && (
          <Snackbar
            position="bottom"
            type="info"
            waitDuration={200}
            autoHideDuration={6000}
            showCloseButton={false}
          >
            <Trans>
              We found an image for you, use the search button to find a better
              one
            </Trans>
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
        <div className="resource">
          {
            //FIXME: there are two identical Modal for `Select Collections` ( look up )
            //(this one is rendered)
            isAddingToCollection && collections && (
              <Modal
                title={t`Select Collections`}
                actions={
                  <PrimaryButton onClick={() => setIsAddingToCollection(false)}>
                    Done
                  </PrimaryButton>
                }
                onClose={() => setIsAddingToCollection(false)}
                style={{ maxWidth: '400px' }}
              >
                <AddToCollectionsCard
                  header={false}
                  noCard={true}
                  multiple
                  name="collections"
                  onChange={addToCollectionsForm.handleChange}
                  value={addToCollectionsForm.values.collections}
                >
                  {collections.opts.map(({ label, value }) => (
                    <OptionItem key={value} label={label} value={value} />
                  ))}
                </AddToCollectionsCard>
              </Modal>
            )
          }
          <div className="content">
            <div className="main-column">
              <Card className="main-resource-card" hideBorderWhenSmall={true}>
                <div className="resource-header">
                  <div className="type-and-actions">
                    <span className="resource-type">
                      <div className="resource">
                        <Trans>Resource</Trans>
                      </div>
                      <div
                        className="type"
                        style={{
                          background: typeColor,
                        }}
                      >
                        {typeName}
                      </div>
                    </span>
                    <div className="actions">
                      {!isEditing && (
                        <div
                          className={`like ${
                            isAuthenticated && !isOwner ? '' : 'disabled'
                          } ${liked && 'liked'}`}
                          onClick={
                            isAuthenticated && !isOwner
                              ? toggleLikeForm.submitForm
                              : () => {}
                          }
                        >
                          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                          <span>{numLikes}</span>
                        </div>
                      )}
                      {isAuthenticated && !isEditing && (
                        <div
                          className={`bookmark ${bookmarked && 'bookmarked'}`}
                          onClick={toggleBookmarkForm.submitForm}
                        >
                          {bookmarked ? (
                            <BookmarkIcon />
                          ) : (
                            <BookmarkBorderIcon />
                          )}
                        </div>
                      )}
                      {isAuthenticated && !isOwner && (
                        <FloatingMenu
                          className="more-button"
                          menuContent={[
                            <div tabIndex={0} onClick={copyUrl}>
                              <ShareIcon />
                              <Trans>Share</Trans>
                            </div>,
                            <div
                              tabIndex={0}
                              onClick={() => setIsReporting(true)}
                            >
                              <FlagIcon />
                              <Trans>Report</Trans>
                            </div>,
                          ]}
                          hoverElement={
                            <TertiaryButton className={`more`}>
                              ...
                            </TertiaryButton>
                          }
                        />
                      )}
                      {(isAdmin || isOwner) && (
                        <div className="edit-save">
                          {isEditing ? (
                            <PrimaryButton
                              className={`${
                                form.isSubmitting ? 'loading' : ''
                              }`}
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
                      name="name"
                      textarea
                      textAreaAutoSize
                      displayMode
                      className="title underline"
                      value={form.values.name}
                      edit={isEditing}
                      onChange={form.handleChange}
                      style={{
                        pointerEvents: `${
                          form.isSubmitting ? 'none' : 'inherit'
                        }`,
                      }}
                      error={isEditing && shouldShowErrors && form.errors.name}
                    />
                  ) : (
                    <div className="title">{form.values.name}</div>
                  )}
                  {tags.length > 0 && (
                    <div className="tags scroll">
                      {getTagList(tags, 'medium')}
                    </div>
                  )}
                </div>
                {(form.values.image || isEditing) && (
                  <div className="image-container">
                    {contentType === 'link' ? (
                      <a href={contentUrl} target="_blank" rel="noreferrer">
                        {imageDiv}
                      </a>
                    ) : (
                      <>{imageDiv}</>
                    )}
                    {getImageCredits(form.values.image)}
                    {isEditing && !form.isSubmitting && (
                      <div className="image-actions">
                        <input
                          ref={uploadImageRef}
                          type="file"
                          accept=".jpg,.jpeg,.png,.gif"
                          onChange={uploadImage}
                          hidden
                        />
                        {canSearchImage && (
                          <RoundButton
                            className={`search-image-button ${
                              form.isSubmitting ? 'disabled' : ''
                            } ${autoImageAdded ? 'highlight' : ''}`}
                            type="search"
                            abbrTitle={t`Search for an image`}
                            onClick={() => setIsSearchingImage(true)}
                          />
                        )}
                        <RoundButton
                          className={`change-image-button ${
                            form.isSubmitting ? 'disabled' : ''
                          }`}
                          type="upload"
                          abbrTitle={t`Upload an image`}
                          onClick={selectImage}
                        />
                        <RoundButton
                          className={`delete-image ${
                            form.isSubmitting ? 'disabled' : ''
                          }`}
                          type="cross"
                          abbrTitle={t`Delete image`}
                          onClick={deleteImage}
                        />
                      </div>
                    )}
                  </div>
                )}
                {isOwner ? (
                  <InputTextField
                    className="description underline"
                    name="description"
                    textarea
                    textAreaAutoSize
                    displayMode
                    edit={isEditing}
                    value={form.values.description}
                    onChange={form.handleChange}
                    style={{
                      pointerEvents: `${
                        form.isSubmitting ? 'none' : 'inherit'
                      }`,
                    }}
                    error={isEditing && form.errors.description}
                  />
                ) : (
                  <div className="description">{form.values.description}</div>
                )}
                {isEditing && (
                  <div className="bottom">
                    <SecondaryButton
                      color="red"
                      onHoverColor="fill-red"
                      onClick={() => setIsToDelete(true)}
                    >
                      <DeleteOutlineIcon />
                    </SecondaryButton>
                  </div>
                )}
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
