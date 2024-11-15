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
import { useEffect, useRef, useState } from 'react'
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
import { isNotFalsy, unreachable_never } from '@moodle/lib-types'
import { getResourceTypeInfo, getTag, getTagList } from '../../../lib/misc'
import { TertiaryButton } from '../../../atoms/TertiaryButton/TertiaryButton'
import { useWindowDimensions } from '../../../lib/hooks'

export type mainResourceCardProps = resourcePageProps & {
  hookFormHandle: simpleUseHookFormActionHookReturn<eduResourceMetaFormSchema, void>
  uploadResourceHandler: useAssetUploaderHandler
  uploadImageHandler: useAssetUploaderHandler
}

export default function MainResourceCard(props: mainResourceCardProps) {
  const { uploadResourceHandler, actions, activity, eduResourceData, hookFormHandle, references } = props
  const { width } = useWindowDimensions()
  const disableFields = activity === 'viewPublished'
  const isEditing = activity === 'editDraft'
  const shouldShowErrors = isEditing

  const typePillAttr = getResourceTypeInfo(eduResourceData?.asset)

  const moreButtonItems = [
    actions.publish && {
      Element: (
        <div key="publish-button" onClick={() => alert('publish')}>
          <Public style={{ fill: '#00bd7e' }} />
          Publish
        </div>
      ),

      wrapperClassName: 'publish-button',
    },
    activity === 'editDraft' && {
      Element: (
        <div
          className={`publish-check-button ${disableFields ? 'disabled' : ''}`}
          key="publish-check-button"
          onClick={() => alert('publishCheck')}
        >
          <Check />
          Publish check
        </div>
      ),
    },
    actions.unpublish && {
      Element: (
        <div key="unpublish-button" onClick={() => alert('unpublish')}>
          <PublicOff />
          Unpublish
        </div>
      ),
      wrapperClassName: 'unpublish-button',
    },
    activity !== 'createDraft' &&
      width < 800 && {
        Element: (
          <div key="open-link-or-download-file-button">
            {eduResourceData.asset.type === 'local' ? (
              <>
                <InsertDriveFile />
                Download
              </>
            ) : eduResourceData.asset.type === 'external' ? (
              <>
                <LinkIcon />
                Open link
              </>
            ) : (
              unreachable_never(eduResourceData.asset)
            )}
          </div>
        ),
      },
    activity === 'viewPublished' && {
      Element: (
        <div key="share-button" onClick={() => alert('copyUrl')}>
          <Share /> Share
        </div>
      ),
    },
    actions.deleteDraft ||
      (actions.deletePublished && {
        Element: (
          <div
            /* className={`delete-button ${emptyOnStart ? 'disabled' : ''}`} */
            className={`delete-button`}
            key="delete-button"
            onClick={() => alert(' setIsToDelete(true)')}
          >
            <Delete /> Delete
          </div>
        ),
      }),
  ].filter(isNotFalsy)

  const descriptionRef = useRef<HTMLDivElement>(null)
  const [showFullDescription, setShowFullDescription] = useState(true)

  useEffect(() => {
    const fieldElem = descriptionRef.current
    if (fieldElem) {
      fieldElem.scrollHeight > 114 && setShowFullDescription(false)
    }
  }, [descriptionRef])

  const bloomLearningOutcomesErrors = hookFormHandle.form.formState.errors.bloomLearningOutcomes

  return (
    <>
      {/* {modals} */}
      <Card className="main-resource-card" key="main-resource-card" hideBorderWhenSmall={true}>
        <div className="resource-header" key="resource-header">
          <div className="top-header-row" key="top-header-row">
            <div className="top-left-header" key="top-left-header">
              <div className="resource-label" key="resource-label">
                Resource
              </div>
              {typePillAttr ? (
                <div
                  className="type-pill"
                  key="type-pill"
                  style={{
                    background: typePillAttr.typeColor,
                  }}
                >
                  {typePillAttr.typeName}
                </div>
              ) : null}
            </div>
            <div className="top-right-header" key="top-right-header">
              {activity === 'viewPublished' && (
                <abbr title="Published" key="publishing-button" style={{ cursor: 'initial' }}>
                  <Public style={{ fill: '#00bd7e' }} />
                </abbr>
              )}
              {actions.unpublish && (
                <abbr title="Unpublished" key="unpublished-button" style={{ cursor: 'initial' }}>
                  <PublicOff style={{ fill: '#a7a7a7' }} />
                </abbr>
              )}
              {moreButtonItems.length > 0 && (
                <FloatingMenu
                  className="more-button"
                  key="more-button"
                  menuContent={moreButtonItems}
                  hoverElement={
                    <TertiaryButton className={`more`} abbr="More options">
                      <MoreVert />
                    </TertiaryButton>
                  }
                />
              )}
              {activity === 'editDraft' && (
                <div className="edit-save">
                  <PrimaryButton className={`save-button`} color="green" onClick={hookFormHandle.handleSubmitWithAction}>
                    <div className="label">
                      <Save />
                    </div>
                  </PrimaryButton>
                </div>
              )}
            </div>
            {isEditing ? (
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
            )}
            {activity === 'viewPublished' ? (
              <div className="tags scroll" key="tags">
                {getTag(
                  { name: references.iscedField.name, appRoute: references.iscedField.homePageRoute, type: 'subject' },
                  'small',
                )}
              </div>
            ) : null}
          </div>

          {activity === 'createDraft' ? (
            <DropUpload useAssetUploaderHandler={uploadResourceHandler} />
          ) : activity === 'editDraft' ? (
            <DropUpload useAssetUploaderHandler={uploadResourceHandler} />
          ) : null}
          {activity === 'editDraft' ? (
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
        </div>
        {props.activity !== 'createDraft' ? (
          <LearningOutcomes
            eduBloomCognitiveRecords={props.eduBloomCognitiveRecords ?? []}
            bloomLearningOutcomes={props.eduResourceData.bloomLearningOutcomes}
            isEditing={activity === 'editDraft'}
            disabled={disableFields}
            error={
              shouldShowErrors && isEditing && bloomLearningOutcomesErrors
                ? bloomLearningOutcomesErrors.map?.(item => item?.learningOutcome?.message ?? '')
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
