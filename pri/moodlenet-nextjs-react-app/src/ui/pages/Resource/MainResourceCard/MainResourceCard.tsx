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
import { resourcePageProps } from '../Resource'
import './MainResourceCard.scss'
import { PrimaryButton } from '../../../atoms/PrimaryButton/PrimaryButton'
import { SecondaryButton } from '../../../atoms/SecondaryButton/SecondaryButton'
import { FloatingMenu, FloatingMenuContentItem } from '../../../atoms/FloatingMenu/FloatingMenu'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { simpleUseHookFormActionHookReturn } from '../../../../lib/common/types'
import { eduResourceMetaFormSchema } from '@moodle/module/edu'
import { useAssetUploaderHandler } from '../../../../lib/client/useAssetUploader'
import { isNotFalsy } from '@moodle/lib-types'

export type mainResourceCardProps = resourcePageProps & {
  hookFormHandle: simpleUseHookFormActionHookReturn<eduResourceMetaFormSchema, void>
  uploadResourceHandler: useAssetUploaderHandler
  uploadImageHandler: useAssetUploaderHandler
}

export default function MainResourceCard(props: mainResourceCardProps) {
  const {uploadImageHandler,eduBloomCognitiveRecords,uploadResourceHandler, actions, activity, contributorCardProps, eduResourceData, hookFormHandle } = props
  const disableFields = activity === 'viewPublished'
  const isEditing = activity === 'editDraft'
  const shouldShowErrors = isEditing
  const title = canEdit ? (
    <InputTextField
      key="title"
      className="title"
      isTextarea
      disabled={disableFields}
      edit={isEditing}
      placeholder="Title"
      textAreaAutoSize
      noBorder
      {...hookFormHandle.form.register('title')}
    />
  ) : (
    <div className="title" key="resource-title">
      {eduResourceData?.title}
    </div>
  )

  const resourceLabel = (
    <div className="resource-label" key="resource-label">
      Resource
    </div>
  )

  const { typeName, typeColor } = getResourceTypeInfo(
    contentType,
    contentType === 'file' ? downloadFilename : currentContentUrl,
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
  ].filter(isNotFalsy)

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

        {activity === 'createDraft' ?<DropUpload useAssetUploaderHandler={uploadResourceHandler}  />

        uploadImageHandler
        {actions.editDraft ? (
          <InputTextField
            className="description"
            key="description"
            disabled={disableFields}
            isTextarea
            textAreaAutoSize
            noBorder
            edit={isEditing}
            placeholder="Description"
            {...hookFormHandle.form.register('description')}
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
              {eduResourceData?.description}
            </div>
            {!showFullDescription && (
              <div className="see-more" onClick={() => setShowFullDescription(true)}>
                ...see more
              </div>
            )}
          </div>
        )}
        {props.activity !== 'createDraft' ? (
          <LearningOutcomes
            eduBloomCognitiveRecords={props.eduBloomCognitiveRecords ?? []}
            bloomLearningOutcomes={props.eduResourceData.bloomLearningOutcomes}
            isEditing={activity === 'editDraft'}
            disabled={disableFields}
            error={
              shouldShowErrors && isEditing && typeof outcomeErrors === 'string'
                ? outcomeErrors
                : Array.isArray(outcomeErrors)
                  ? outcomeErrors.map(item => (typeof item !== 'string' && item.sentence ? item.sentence : ''))
                  : undefined
            }
            shouldShowErrors={shouldShowErrors}
            edit={values => hookFormHandle.form.setValue('bloomLearningOutcomes', values)}
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
