import {
  Check,
  Delete,
  Edit,
  InsertDriveFile,
  Link as LinkIcon,
  MoreVert,
  Public,
  PublicOff,
  Save,
  Share,
} from '@mui/icons-material'
import { useEffect, useRef } from 'react'
import { Card } from '../../../atoms/Card/Card'
import { DropUpload } from '../../../organisms/DropUpload/DropUpload'
import { LearningOutcomes } from '../../../organisms/ed-meta/LearningOutcomes/LearningOutcomes'
import { ResourcePageProps } from '../Resource'
import './MainResourceCard.scss'

export type MainResourceCardProps = {
  disableFields: boolean
} & ResourcePageProps

export default function MainResourceCard({ disableFields }: MainResourceCardProps) {
  const isEditing = activity === 'editDraft'

  const title = canEdit ? (
    <InputTextField
      name="title"
      key="title"
      className="title"
      isTextarea
      disabled={disableFields}
      edit={isEditing}
      value={form.values.title}
      placeholder="Title"
      onChange={form.handleChange}
      error={shouldShowErrors && isEditing && form.errors.title}
      textAreaAutoSize
      noBorder
    />
  ) : (
    <div className="title" key="resource-title">
      {form.values.title}
    </div>
  )

  const resourceLabel = (
    <div className="resource-label" key="resource-label">
      Resource
    </div>
  )

  const typePill =
    contentForm.values.content && typeName && typeColor ? (
      <div
        className="type-pill"
        key="type-pill"
        style={{
          background: typeColor,
        }}
      >
        {typeName}
      </div>
    ) : null

  const updatedTopLeftHeaderItems = [
    resourceLabel,
    typePill,
    // savingFeedback,
    ...(topLeftHeaderItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const empty =
    (!form.values.title || form.values.title === '') &&
    (!form.values.description || form.values.description === '') &&
    !(form.values.learningOutcomes.length > 0) &&
    !contentForm.values.content &&
    !imageForm.values.image

  const updatedMoreButtonItems = [
    !isEditing && canPublish && !isPublished
      ? {
          Element: (
            <div key="publish-button" onClick={publish}>
              <Public style={{ fill: '#00bd7e' }} />
              Publish
            </div>
          ),

          wrapperClassName: 'publish-button',
        }
      : null,
    // isEditing && canPublish && !isPublished
    isEditing && canPublish && !isPublished && (hasAllData || disableFields)
      ? {
          Element: (
            <div
              className={`publish-check-button ${disableFields ? 'disabled' : ''}`}
              key="publish-check-button"
              onClick={publishCheck}
            >
              <Check />
              Publish check
            </div>
          ),
        }
      : null,
    canPublish && isPublished
      ? {
          Element: (
            <div key="unpublish-button" onClick={unpublish}>
              <PublicOff />
              Unpublish
            </div>
          ),
          wrapperClassName: 'unpublish-button',
        }
      : null,
    width < 800 && contentUrl
      ? {
          Element:
            contentType === 'file' ? (
              <div key="open-link-or-download-file-button" onClick={() => downloadOrOpenURL(contentUrl, downloadFilename)}>
                <InsertDriveFile />
                Download
              </div>
            ) : (
              <div key="open-link-or-download-file-button" onClick={() => downloadOrOpenURL(contentUrl, downloadFilename)}>
                <LinkIcon />
                Open link
              </div>
            ),
        }
      : null,
    isPublished
      ? {
          Element: (
            <div key="share-button" onClick={copyUrl}>
              <Share /> Share
            </div>
          ),
        }
      : null,
    canDelete
      ? {
          Element: (
            <div
              className={`delete-button ${emptyOnStart ? 'disabled' : ''}`}
              key="delete-button"
              onClick={() => !emptyOnStart && setIsToDelete(true)}
            >
              <Delete /> Delete
            </div>
          ),
        }
      : null,
    ...(moreButtonItems ?? []),
  ].filter((item): item is FloatingMenuContentItem => !!item)

  const disableSaveButton = (empty && emptyOnStart) || autofillState === 'ai-generation'

  const updatedTopRightHeaderItems = [
    canPublish && isPublished ? (
      <abbr title="Published" key="publishing-button" style={{ cursor: 'initial' }}>
        <Public style={{ fill: '#00bd7e' }} />
      </abbr>
    ) : null,
    canPublish && !isPublished ? (
      <abbr title="Unpublished" key="unpublished-button" style={{ cursor: 'initial' }}>
        <PublicOff style={{ fill: '#a7a7a7' }} />
      </abbr>
    ) : null,
    ...(topRightHeaderItems ?? []),
    updatedMoreButtonItems.length > 0 ? (
      // updatedMoreButtonItems.length === 1 ? (
      //   updatedMoreButtonItems.map(i => {
      //     return (
      //       <TertiaryButton
      //         key={i.key}
      //         abbr={i.text}
      //         onClick={i.onClick}
      //         className={i.className ?? i.key}
      //       >
      //         {i.Icon}
      //       </TertiaryButton>
      //     )
      //   })
      // ) : (
      <FloatingMenu
        className="more-button"
        key="more-button"
        menuContent={updatedMoreButtonItems}
        hoverElement={
          <TertiaryButton className={`more`} abbr="More options">
            <MoreVert />
          </TertiaryButton>
        }
      />
    ) : // )
    null,
    canEdit && !isPublished
      ? {
          Item: () => (
            <div className="edit-save">
              {isEditing && (
                <PrimaryButton
                  className={`save-button`}
                  color="green"
                  onClick={handleOnSaveClick}
                  disabled={disableSaveButton}
                >
                  <div className="label">
                    <Save />
                  </div>
                </PrimaryButton>
              )}
              {!isEditing && (
                <SecondaryButton className="edit-button" onClick={handleOnEditClick} color="orange">
                  <Edit />
                </SecondaryButton>
              )}
            </div>
          ),
          key: 'edit-save-button',
        }
      : null,
  ].filter((item): item is AddonItem => !!item)

  const topHeaderRow = (
    <div className="top-header-row" key="top-header-row">
      <div className="top-left-header" key="top-left-header">
        {updatedTopLeftHeaderItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
      <div className="top-right-header" key="top-right-header">
        {updatedTopRightHeaderItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    </div>
  )

  const subjectLabel = subjectOptions.find(({ ['value']: value }) => value && value === form.values.subject)

  const tagsContainer = subjectLabel ? (
    <div className="tags scroll" key="tags">
      {getTagList([{ name: subjectLabel.label, href: subjectHref, type: 'subject' }], 'small')}
    </div>
  ) : null

  const updatedHeaderColumnItems = [topHeaderRow, title, tagsContainer, ...(headerColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const descriptionRef = useRef<HTMLDivElement>(null)
  const [showFullDescription, setShowFullDescription] = useState(true)

  useEffect(() => {
    const fieldElem = descriptionRef.current
    if (fieldElem) {
      fieldElem.scrollHeight > 114 && setShowFullDescription(false)
    }
  }, [descriptionRef])

  const outcomeErrors = form.errors.learningOutcomes

  return (
    <>
      {/* {modals} */}
      <Card className="main-resource-card" key="main-resource-card" hideBorderWhenSmall={true}>
        <div className="resource-header" key="resource-header">
          {updatedHeaderColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
        </div>

        {(imageForm.values.image || isEditing) && <DropUpload displayOnly={canEdit && !isEditing} key="resource-uploader" />}
        {canEdit ? (
          <InputTextField
            className="description"
            name="description"
            key="description"
            disabled={disableFields}
            isTextarea
            textAreaAutoSize
            noBorder
            edit={isEditing}
            placeholder="Description"
            value={form.values.description}
            onChange={form.handleChange}
            error={shouldShowErrors && isEditing && form.errors.description}
          />
        ) : (
          <div className="description" key="description-container">
            <div
              className="description-text"
              ref={descriptionRef}
              style={{
                height: showFullDescription ? 'fit-content' : '110px',
                overflow: showFullDescription ? 'auto' : 'hidden',
              }}
            >
              {form.values.description}
            </div>
            {!showFullDescription && (
              <div className="see-more" onClick={() => setShowFullDescription(true)}>
                ...see more
              </div>
            )}
          </div>
        )}
        {isEditing || form.values.learningOutcomes.filter(e => e.sentence !== '').length > 0 ? (
          <LearningOutcomes
            learningOutcomeRecords={learningOutcomeOptions}
            learningOutcomes={form.values.learningOutcomes}
            isEditing={isEditing}
            disabled={disableFields}
            error={
              shouldShowErrors && isEditing && typeof outcomeErrors === 'string'
                ? outcomeErrors
                : Array.isArray(outcomeErrors)
                  ? outcomeErrors.map(item => (typeof item !== 'string' && item.sentence ? item.sentence : ''))
                  : undefined
            }
            shouldShowErrors={shouldShowErrors}
            edit={values => form.setFieldValue('learningOutcomes', values)}
          />
        ) : null}
        <div className="resource-footer" key="resource-footer"></div>
      </Card>
    </>
  )
}
/*

  const { addSnackbar } = useSnackbar()

  if (showUrlCopiedAlert) {
    addSnackbar(
      <Snackbar
        type="success"
        position="bottom"
        autoHideDuration={3000}
        showCloseButton={false}
        key="url-copy-snackbar"
      >
        Link copied to clipoard
      </Snackbar>,
    )
  }

  if (showSaveError) {
    addSnackbar(
      <Snackbar
        position="bottom"
        type="error"
        autoHideDuration={3000}
        showCloseButton={false}
        onClose={() => setShowSaveError(false)}
      >
        Failed, fix the errors and try again
      </Snackbar>,
    )
  }

  const modals = [
    isToDelete && deleteResource && (
      <Modal
        title={`Alert`}
        actions={
          <PrimaryButton
            onClick={() => {
              deleteResource()
              setIsToDelete(false)
            }}
            color="red"
          >
            Delete
          </PrimaryButton>
        }
        onClose={() => setIsToDelete(false)}
        onPressEnter={() => {
          deleteResource()
          setIsToDelete(false)
        }}
        style={{ maxWidth: '400px' }}
        className="delete-message"
        key="delete-message-modal"
      >
        The resource will be deleted
      </Modal>
    ),
  ]

 */
