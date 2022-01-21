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
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import React, { useCallback, useRef, useState } from 'react'
import { tagList } from '../../../elements/tags'
import { CP, withCtrl } from '../../../lib/ctrl'
import { FormikHandle } from '../../../lib/formik'
import { SelectOptions, SelectOptionsMulti } from '../../../lib/types'
import { useImageUrl } from '../../../lib/useImageUrl'
import defaultBackgroud from '../../../static/img/default-background.svg'
import { FollowTag, getResourceColorType } from '../../../types'
import Card from '../../atoms/Card/Card'
import {
  Dropdown,
  IconPill,
  IconTextOption,
  IconTextOptionProps,
  SimplePill,
  TextOption,
  TextOptionProps,
} from '../../atoms/DropdownNew/Dropdown'
import { InputTextField } from '../../atoms/InputTextFieldNew/InputTextField'
import Modal from '../../atoms/Modal/Modal'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import RoundButton from '../../atoms/RoundButton/RoundButton'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import {
  AddToCollectionsCard,
  OptionItem,
  OptionItemProp,
} from '../../molecules/cards/AddToCollectionsCard/AddToCollectionsCard'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import {
  MonthTextOptionProps,
  YearsProps,
} from '../NewResource/ExtraDetails/storiesData'
import { NewResourceFormValues } from '../NewResource/types'
import {
  ContributorCard,
  ContributorCardProps,
} from './ContributorCard/ContributorCard'
import './styles.scss'

export type ResourceFormValues = Omit<NewResourceFormValues, 'addToCollections'>
export type ResourceProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  isAuthenticated: boolean
  isOwner: boolean
  isAdmin: boolean
  numLikes: number
  collections: SelectOptionsMulti<OptionItemProp>
  liked: boolean
  bookmarked: boolean
  tags: FollowTag[]
  contributorCardProps: ContributorCardProps
  form: FormikHandle<Omit<ResourceFormValues, 'addToCollections'>>
  categories: SelectOptions<TextOptionProps>
  licenses: SelectOptions<IconTextOptionProps>
  types: SelectOptions<TextOptionProps>
  levels: SelectOptions<TextOptionProps>
  languages: SelectOptions<TextOptionProps>
  contentUrl: string
  toggleLike: FormikHandle
  toggleBookmark: FormikHandle
  deleteResource?: FormikHandle
  addToCollectionsForm: FormikHandle<{ collections: string[] }>
  sendToMoodleLms: FormikHandle<{ site?: string }>
  sendToMoodleLmsError?: string | undefined
  resourceFormat: string
  contentType: 'link' | 'file'
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
    types,
    levels,
    languages,
    licenses,
    categories,
    collections,
    form,
    sendToMoodleLmsError,
    toggleLike,
    toggleBookmark,
    deleteResource,
    sendToMoodleLms,
    contentUrl,
    resourceFormat,
    contentType,
    addToCollectionsForm,
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
    const [shouldShowSendToMoodleLmsError, setShouldShowSendToMoodleLmsError] =
      useState<boolean>(false)
    const [isAddingToCollection, setIsAddingToCollection] =
      useState<boolean>(false)
    const [isAddingToMoodleLms, setIsAddingToMoodleLms] =
      useState<boolean>(false)
    const [isToDelete, setIsToDelete] = useState<boolean>(false)
    const [isShowingImage, setIsShowingImage] = useState<boolean>(false)

    //const [isLeaving, setIsLeaving] = useState<boolean>(false)
    //const [hasMadeChanges, setHasMadeChanges] = useState<string>(lmsSite ?? '')

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

    const handleOnSendToMoodleClick = () => {
      if (sendToMoodleLms.isValid) {
        sendToMoodleLms.submitForm()
        setIsAddingToMoodleLms(false)
        setShouldShowSendToMoodleLmsError(false)
      } else {
        setShouldShowSendToMoodleLmsError(true)
      }
    }

    const uploadImageRef = useRef<HTMLInputElement>(null)
    const selectImage = () => {
      uploadImageRef.current?.click()
    }

    const uploadImage = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.currentTarget.files?.item(0)
        selectedFile && form.setFieldValue('image', selectedFile)
      },
      [form]
    )
    const [imageUrl] = useImageUrl(form.values.image, defaultBackgroud)
    const image = (
      <img
        className="image"
        src={imageUrl ? imageUrl : undefined}
        alt="Background"
        {...(contentType === 'file' && {
          onClick: () => setIsShowingImage(true),
        })}
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
          download={form.values.name}
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
          name="visibility"
          value={form.values.visibility}
          onChange={form.handleChange}
          disabled={!isEditing}
          edit={isEditing}
          label="Visibility"
          highlight={shouldShowErrors && !!form.errors.visibility}
          error={form.errors.visibility}
          pills={
            form.values.visibility && (
              <IconPill
                icon={
                  form.values.visibility === 'public' ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )
                }
              />
            )
          }
          className="visibility-dropdown"
        >
          {form.values.visibility !== 'public' && (
            <IconTextOption
              key={'public'}
              value={'public'}
              label={t`Public`}
              icon={<VisibilityIcon />}
            />
          )}
          {form.values.visibility !== 'private' && (
            <IconTextOption
              key={'private'}
              value={'private'}
              label={t`Private`}
              icon={<VisibilityOffIcon />}
            />
          )}
        </Dropdown>
        <Dropdown
          name="category"
          value={form.values.category}
          onChange={form.handleChange}
          label="Subject"
          disabled={!isEditing}
          edit={isEditing}
          highlight={shouldShowErrors && !!form.errors.category}
          error={form.errors.category}
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
          {categories.opts.map(({ label, value }) => (
            <TextOption key={value} value={value} label={label} />
          ))}
        </Dropdown>
        <Dropdown
          name="license"
          onChange={form.handleChange}
          value={form.values.license}
          label={t`License`}
          edit
          highlight={shouldShowErrors && !!form.errors.license}
          error={form.errors.license}
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
            <IconTextOption icon={icon} label={label} value={value} />
          ))}
        </Dropdown>
        <Dropdown
          name="type"
          label={t`Type`}
          value={form.values.type}
          onChange={form.handleChange}
          edit
          pills={
            types.selected && (
              <SimplePill
                label={types.selected.label}
                value={types.selected.value}
              />
            )
          }
        >
          {types.opts.map(({ label, value }) => (
            <TextOption key={value} label={label} value={value} />
          ))}
        </Dropdown>
        <Dropdown
          name="level"
          label={t`Level`}
          value={form.values.level}
          onChange={form.handleChange}
          edit
          pills={
            levels.selected && (
              <SimplePill
                label={levels.selected.label}
                value={levels.selected.value}
              />
            )
          }
        >
          {levels.opts.map(({ label, value }) => (
            <TextOption key={value} label={label} value={value} />
          ))}
        </Dropdown>{' '}
        <div className="date">
          <label>
            <Trans>Original creation date</Trans>
          </label>
          <div className="fields">
            <Dropdown
              name="month"
              onChange={form.handleChange}
              label=""
              value={form.values.month}
              edit
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
              error={form.errors.year}
              edit
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
          pills={
            languages.selected && (
              <SimplePill
                label={languages.selected.label}
                value={languages.selected.value}
              />
            )
          }
        >
          {languages.opts.map(({ label, value }) => (
            <TextOption key={value} label={label} value={value} />
          ))}
        </Dropdown>
        <Dropdown
          name="format"
          label={t`Format`}
          defaultValue={resourceFormat}
          disabled
          pills={<SimplePill label={resourceFormat} value={resourceFormat} />}
        ></Dropdown>
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
          <abbr className="value">{categories.selected?.label}</abbr>
        </div>
        {licenses.selected && (
          <div className="detail">
            <div className="title">
              <Trans>License</Trans>
            </div>
            <abbr className="value" title={licenses.selected.label}>
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
              className="value date"
              title={`${
                MonthTextOptionProps.find(
                  ({ value }) => value === form.values.month
                )!.label
              } ${form.values.year}`}
            >
              <span>
                {
                  MonthTextOptionProps.find(
                    ({ value }) => value === form.values.month
                  )!.label
                }
              </span>
              <span>{form.values.year}</span>
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
        {resourceFormat && (
          <div className="detail">
            <div className="title">
              <Trans>Format</Trans>
            </div>
            <abbr className="value" title={resourceFormat}>
              {resourceFormat}
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
        {isShowingImage && typeof imageUrl === 'string' && (
          <Modal
            className="image-modal"
            closeButton={false}
            onClose={() => setIsShowingImage(false)}
            style={{ maxWidth: '90%', maxHeight: '90%' }}
          >
            <img src={imageUrl} alt="Resource" />
          </Modal>
        )}
        {
          //FIXME: there are two identical Modal for `Select Collections` ( look down )
          isAddingToCollection && collections && (
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
            actions={[
              <PrimaryButton
                onClick={() => {
                  handleOnSendToMoodleClick()
                }}
              >
                <Trans>Send</Trans>
              </PrimaryButton>,
            ]}
            onClose={() => {
              setIsAddingToMoodleLms(false)
              setShouldShowSendToMoodleLmsError(false)
            }}
            style={{ maxWidth: '350px', width: '100%' }}
          >
            <InputTextField
              placeholder="http://your-moodle-lms-site.com"
              value={sendToMoodleLms.values.site}
              name="site"
              onChange={sendToMoodleLms.handleChange}
              error={shouldShowSendToMoodleLmsError && sendToMoodleLmsError}
            />
          </Modal>
        )}
        {isToDelete && deleteResource && (
          <Modal
            title={t`Alert`}
            actions={[
              <PrimaryButton
                onClick={() => {
                  deleteResource.submitForm()
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
          {
            //FIXME: there are two identical Modal for `Select Collections` ( look up )
            //(this one is rendered)
            isAddingToCollection && collections && (
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
                    <span className="type">
                      <Trans>Resource</Trans>
                      <div
                        style={{
                          color: getResourceColorType(contentType),
                        }}
                      >
                        &nbsp;/ {contentType}
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
                            isAuthenticated && !isOwner
                              ? toggleLike.submitForm
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
                          onClick={toggleBookmark.submitForm}
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
                      name="name"
                      className="title"
                      value={form.values.name}
                      edit={isEditing}
                      onChange={form.handleChange}
                      error={isEditing && shouldShowErrors && form.errors.name}
                      // error={
                      //   isEditing &&
                      //   shouldShowErrors &&
                      //   'Error with the title field'
                      // }
                    />
                  ) : (
                    <div className="title">{form.values.name}</div>
                  )}
                  {tags.length > 0 && (
                    <div className="tags scroll">{tagList(tags, 'medium')}</div>
                  )}
                </div>
                {(typeof imageUrl === 'string' || isEditing) && (
                  <div className="image-container">
                    {contentType === 'link' ? (
                      <a href={contentUrl} target="_blank" rel="noreferrer">
                        {image}
                      </a>
                    ) : (
                      image
                    )}

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
                )}
                {isOwner ? (
                  <InputTextField
                    name="description"
                    textarea
                    textAreaAutoSize
                    value={form.values.description}
                    displayMode
                    edit={isEditing}
                    onChange={form.handleChange}
                    error={isEditing && form.errors.description}
                    // error={
                    //   isEditing &&
                    //   shouldShowErrors &&
                    //   'Error with the description field'
                    // }
                  />
                ) : (
                  <div className="description">{form.values.description}</div>
                )}
                {isEditing && (
                  <div className="bottom">
                    <SecondaryButton
                      color="red"
                      onHoverColor="filled-red"
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
