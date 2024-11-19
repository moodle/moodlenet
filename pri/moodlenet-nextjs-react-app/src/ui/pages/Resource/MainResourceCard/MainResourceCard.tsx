import { zodResolver } from '@hookform/resolvers/zod'
import { isNotFalsy, unreachable_never, url_string_schema } from '@moodle/lib-types'
import { eduResourceMetaFormSchema } from '@moodle/module/edu'
import {
  Check,
  Delete,
  InsertDriveFile,
  Link as LinkIcon,
  MoreVert,
  Public,
  PublicOff,
  Save,
  Share,
} from '@mui/icons-material'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { object } from 'zod'
import { useAssetUrl } from '../../../../lib/client/globalContexts'
import { useAssetUploader } from '../../../../lib/client/useAssetUploader'
import { simpleHookSafeAction, simpleUseHookFormActionHookReturn } from '../../../../lib/common/actions'
import { Card } from '../../../atoms/Card/Card'
import { FloatingMenu } from '../../../atoms/FloatingMenu/FloatingMenu'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../atoms/PrimaryButton/PrimaryButton'
import { TertiaryButton } from '../../../atoms/TertiaryButton/TertiaryButton'
import { useWindowDimensions } from '../../../lib/hooks'
import { getResourceTypeInfo, getTag } from '../../../lib/misc'
import { DropUpload } from '../../../organisms/DropUpload/DropUpload'
import { LearningOutcomes } from '../../../organisms/ed-meta/LearningOutcomes/LearningOutcomes'
import { resourcePageProps } from '../Resource'
import './MainResourceCard.scss'

export type mainResourceCardProps = resourcePageProps & {
  hookFormHandle: simpleUseHookFormActionHookReturn<eduResourceMetaFormSchema, void>
}

export default function MainResourceCard(props: mainResourceCardProps) {
  const { width } = useWindowDimensions()
  const { t } = useTranslation()
  const { actions, activity, eduResourceData, hookFormHandle, references } = props
  const [resourceUrl] = useAssetUrl(eduResourceData?.asset)

  const uploadResourceHandler = useAssetUploader('file', null, actions.saveNewResourceAsset, { nonNullable: true })
  const { state: resourceUploaderState, submit: resourceUploaderSubmit } = uploadResourceHandler
  useEffect(() => {
    if (resourceUploaderState.type === 'selected') {
      resourceUploaderSubmit()
    }
  }, [resourceUploaderState, resourceUploaderSubmit])
  const newResourceLinkFormSchema = object({ url: url_string_schema })
  const newResourceLinkFormAction: simpleHookSafeAction<typeof newResourceLinkFormSchema, undefined> = async input => {
    return actions
      .saveNewResourceAsset?.({
        type: 'external',
        url: newResourceLinkFormSchema.parse(input).url,
      })
      .then(
        () => undefined,
        err => ({ validationErrors: { url: { _errors: [String(err)] } } }),
      )
  }
  const newResourceLinkHookForm = useHookFormAction(newResourceLinkFormAction, zodResolver(newResourceLinkFormSchema))

  const descriptionRef = useRef<HTMLDivElement>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const descriptionFieldElemRefScrollHeight = descriptionRef.current?.scrollHeight
  useEffect(() => {
    if (!descriptionFieldElemRefScrollHeight) {
      return
    }
    setShowFullDescription(descriptionFieldElemRefScrollHeight < 114)
  }, [descriptionFieldElemRefScrollHeight])

  const uploadImageHandler = useAssetUploader('webImage', eduResourceData?.image, actions.editDraft?.applyImage)
  const saveDraft = useCallback(() => {
    uploadImageHandler.state.dirty && uploadImageHandler.submit()
    hookFormHandle.form.formState.isDirty && hookFormHandle.handleSubmitWithAction()
  }, [uploadImageHandler, hookFormHandle])

  const isDirty = uploadImageHandler.state.dirty || hookFormHandle.form.formState.isDirty

  const typePillAttr = getResourceTypeInfo(eduResourceData?.asset)
  const moreButtonItems = getMoreButtons()
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
                  <PrimaryButton className={`save-button`} color="green" onClick={saveDraft} disabled={!isDirty}>
                    <div className="label">
                      <Save />
                    </div>
                  </PrimaryButton>
                </div>
              )}
            </div>

            {activity === 'viewPublished' ? (
              <div className="tags scroll" key="tags">
                {getTag(
                  { name: references.iscedField.name, appRoute: references.iscedField.homePageRoute, type: 'subject' },
                  'small',
                )}
              </div>
            ) : null}
          </div>
          {activity === 'editDraft' ? (
            <InputTextField
              key="title"
              className="title"
              isTextarea
              edit={activity === 'editDraft'}
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
          {activity === 'createDraft' ? (
            <>
              <DropUpload useAssetUploaderHandler={uploadResourceHandler} />
              <InputTextField
                className="link"
                placeholder={t`Paste or type a link`}
                edit
                onKeyDown={e => e.key === 'Enter' && newResourceLinkHookForm.handleSubmitWithAction(e)}
                rightSlot={<PrimaryButton onClick={newResourceLinkHookForm.handleSubmitWithAction}>Add</PrimaryButton>}
                {...newResourceLinkHookForm.form.register('url')}
                error={newResourceLinkHookForm.form.formState.errors.url?.message}
              />
            </>
          ) : activity === 'editDraft' || activity === 'viewPublished' ? (
            <DropUpload useAssetUploaderHandler={uploadImageHandler} displayOnly={activity === 'viewPublished'} />
          ) : null}
          {activity !== 'editDraft' ? (
            <InputTextField
              className="description"
              key="description"
              isTextarea
              textAreaAutoSize
              noBorder
              edit={activity === 'createDraft'}
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
            disabled={activity === 'viewPublished'}
            error={
              activity === 'editDraft' &&
              activity === 'editDraft' &&
              hookFormHandle.form.formState.errors.bloomLearningOutcomes?.map
                ? hookFormHandle.form.formState.errors.bloomLearningOutcomes.map(
                    item => item?.learningOutcome?.message ?? '',
                  )
                : undefined
            }
            shouldShowErrors={activity === 'editDraft'}
            edit={values => hookFormHandle.form.setValue('bloomLearningOutcomes', values)}
          />
        ) : null}
        <div className="resource-footer" key="resource-footer"></div>
      </Card>
    </>
  )

  function getMoreButtons() {
    return [
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
          <div className={`publish-check-button`} key="publish-check-button" onClick={() => alert('publishCheck')}>
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
                  <a href={resourceUrl} target="_blank" rel="noopener noreferrer" download={eduResourceData.asset.name}>
                    Download
                  </a>
                </>
              ) : eduResourceData.asset.type === 'external' ? (
                <>
                  <LinkIcon />
                  <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
                    Open link
                  </a>
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
  }
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
