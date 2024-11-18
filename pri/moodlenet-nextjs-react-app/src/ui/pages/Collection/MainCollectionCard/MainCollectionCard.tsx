// import type { AddonItem, FloatingMenuContentItem } from '@moodlenet/component-library'
// import {
//   Card,
//   FloatingMenu,
//   InputTextField,
//   Modal,
//   PrimaryButton,
//   SecondaryButton,
//   Snackbar,
//   TertiaryButton,
// } from '@moodlenet/component-library'
// import type { AssetInfoForm } from '@moodlenet/component-library/common'
// import type { FormikHandle } from '@moodlenet/react-app/ui'
// import { Check, Delete, Edit, MoreVert, Public, PublicOff, Save, Share } from '@mui/icons-material'

import Check from '@mui/icons-material/Check'
import Delete from '@mui/icons-material/Delete'
import MoreVert from '@mui/icons-material/MoreVert'
import Public from '@mui/icons-material/Public'
import PublicOff from '@mui/icons-material/PublicOff'
import Save from '@mui/icons-material/Save'
import Share from '@mui/icons-material/Share'

// import type { FC } from 'react'
import { useCallback, useMemo, useState } from 'react'
// import type {
//   CollectionAccessProps,
//   CollectionActions,
//   CollectionDataProps,
//   CollectionFormProps,
//   CollectionStateProps,
// } from '../../../../common/types.mjs'
// import { UploadImage } from '../UploadImage/UploadImage'
import { zodResolver } from '@hookform/resolvers/zod'
import { isNotFalsy } from '@moodle/lib-types'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { useAllPrimarySchemas } from '../../../../lib/client/globalContexts'
import { Card } from '../../../atoms/Card/Card'
import { FloatingMenu } from '../../../atoms/FloatingMenu/FloatingMenu'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../atoms/PrimaryButton/PrimaryButton'
import { TertiaryButton } from '../../../atoms/TertiaryButton/TertiaryButton'
import { collectionPageProps } from '../Collection'
import './MainCollectionCard.scss'
import { DropUpload } from '../../../organisms/DropUpload/DropUpload'
import { useAssetUploader } from '../../../../lib/client/useAssetUploader'
import { default_noop_action } from '../../../../lib/common/actions'

export function MainCollectionCard({
  collectionPageProps: { activity, actions, eduCollectionData },
}: {
  collectionPageProps: collectionPageProps
}) {
  // const collectionLabel = (
  //   <div className="collection-label" key="collection-label">
  //     Collection
  //   </div>
  // )

  // const imageDiv = (
  //   <div
  //     className="image"
  //     onClick={() => setIsShowingImage(true)}
  //     // style={{ maxHeight: form.values.image ? 'fit-content' : '150px' }}
  //     style={{ backgroundImage: `url(${image})` }}
  //   />
  // )

  // const imageContainer = !canEdit ? (
  //   imageForm.values.image || imageUrl ? (
  //     <div className="image-container" key="image-container">
  //       {imageDiv}
  //     </div>
  //   ) : null
  // ) : null

  // const snackbars = (
  //   <>
  //     {showUrlCopiedAlert && (
  //       <Snackbar type="success" position="bottom" autoHideDuration={3000} showCloseButton={false}>
  //         Link copied to clipoard
  //       </Snackbar>
  //     )}
  //   </>
  // )

  // const modals = [
  //   isToDelete && deleteCollection && (
  //     <Modal
  //       title={`Alert`}
  //       actions={
  //         <PrimaryButton
  //           onClick={() => {
  //             deleteCollection()
  //             setIsToDelete(false)
  //           }}
  //           color="red"
  //         >
  //           Delete
  //         </PrimaryButton>
  //       }
  //       onClose={() => setIsToDelete(false)}
  //       style={{ maxWidth: '400px' }}
  //       className="delete-message"
  //     >
  //       The collection will be deleted
  //     </Modal>
  //   ),
  // ]
  const schemas = useAllPrimarySchemas()
  const {
    form: { formState, register, reset, getValues },
    handleSubmitWithAction: submitFormMeta,
  } = useHookFormAction(
    default_noop_action(
      activity === 'createDraft' ? actions.saveNewDraft : activity === 'editDraft' ? actions.editDraft.saveMeta : null,
    ),
    zodResolver(schemas.edu.eduCollectionMetaSchema),
    {
      formProps: { defaultValues: eduCollectionData ?? {} },
      actionProps: {
        onSuccess({ input }) {
          reset(input)
        },
      },
    },
  )
  const imageAssetUploaderHandler = useAssetUploader('webImage', eduCollectionData?.image, actions.editDraft?.applyImage)

  const submitForm = useCallback(() => {
    formState.isDirty && submitFormMeta()
    imageAssetUploaderHandler.state.dirty && imageAssetUploaderHandler.submit()
  }, [formState.isDirty, imageAssetUploaderHandler, submitFormMeta])

  const isDirty = imageAssetUploaderHandler.state.dirty || formState.isDirty
  const isSubmitting = imageAssetUploaderHandler.state.type === 'submitting' || formState.isSubmitting

  // const descriptionEditRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)
  // const descriptionRef = useRef<HTMLDivElement>(null)

  // const [alwaysFullDescription, setAlwaysFullDescription] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(true)

  // useEffect(() => {
  //   const fieldElem = descriptionRef.current ?? descriptionEditRef.current
  //   if (fieldElem) {
  //     /* canEdit &&  */ fieldElem.scrollHeight < 80 && setAlwaysFullDescription(true)
  //     setShowFullDescription(/* canEdit || */ alwaysFullDescription || fieldElem.scrollHeight < 80)
  //   }
  // }, [descriptionRef.current?.scrollHeight, descriptionEditRef.current?.scrollHeight, alwaysFullDescription])

  const confirmDelete = useMemo(() => {
    return activity === 'editDraft' ? actions.deleteDraft : activity === 'viewPublished' ? actions.deletePublished : null
  }, [actions.deleteDraft, actions.deletePublished, activity])

  const moreButtonItems = useMemo(() => {
    return [
      activity === 'editDraft' &&
        actions.publish && {
          Element: (
            <div key="publish-button" onClick={actions.publish}>
              <Public style={{ fill: '#00bd7e' }} />
              Publish
            </div>
          ),
        },

      activity === 'editDraft' && {
        Element: (
          <div key="publish-button" onClick={() => alert('publishCheck')}>
            <Check style={{ fill: '#00bd7e' }} />
            Publish check
          </div>
        ),
      },

      activity === 'viewPublished' &&
        actions.unpublish && {
          Element: (
            <div
              key="unpublish-button"
              onClick={() => {
                actions.unpublish?.()
              }}
            >
              <PublicOff />
              Unpublish
            </div>
          ),
        },

      activity === 'viewPublished' && {
        Element: (
          <div key="share-button" onClick={() => alert('copyUrl')}>
            <Share />
            Share
          </div>
        ),
      },

      activity !== 'createDraft' &&
        confirmDelete && {
          Element: (
            <div className={`delete-button _disabled`} key="delete-button" onClick={confirmDelete}>
              <Delete />
              Delete
            </div>
          ),
        },
    ].filter(isNotFalsy)
  }, [actions, activity, confirmDelete])

  const currentValues = getValues()
  return (
    <>
      {/* {modals}
      {snackbars} */}
      {/* {searchImageComponent} */}
      <Card className="main-collection-card" hideBorderWhenSmall={true}>
        {activity === 'editDraft' && (
          <DropUpload
            useAssetUploaderHandler={imageAssetUploaderHandler}
            // backupImage={backupImage}
            key="collection-uploader"
          />
        )}

        <div className="collection-header" key="collection-header">
          <div className="top-header-row" key="top-header-row">
            <div className="top-left-header"></div>
            <div className="top-right-header">
              {activity === 'viewPublished' && (
                <abbr title="Published" key="publishing-button" style={{ cursor: 'initial' }}>
                  <Public style={{ fill: '#00bd7e' }} />
                </abbr>
              )}
              {activity === 'editDraft' && (
                <abbr title="Unpublished" key="unpublished-button" style={{ cursor: 'initial' }}>
                  <PublicOff style={{ fill: '#a7a7a7' }} />
                </abbr>
              )}
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
              {activity !== 'viewPublished' && (
                <div className="edit-save">
                  <PrimaryButton color="green" onClick={submitForm} disabled={!isDirty || isSubmitting}>
                    <div className="label">
                      <Save />
                    </div>
                  </PrimaryButton>

                  {/* !isEditing && (
                  <SecondaryButton onClick={() => alert('handleOnEditClick')} color="orange">
                    <Edit />
                  </SecondaryButton>
                ) */}
                </div>
              )}
            </div>
          </div>
          {activity !== 'viewPublished' ? (
            <InputTextField
              className="title"
              isTextarea
              placeholder="Title"
              /* edit */
              textAreaAutoSize
              noBorder
              {...register('title')}
              error={formState.errors.title?.message}
            />
          ) : (
            <div className="title" key="title">
              {currentValues.title}
            </div>
          )}
        </div>
        <div
          className="description-container"
          key="description-container"
          style={{
            height: showFullDescription ? 'fit-content' : '66px',
            overflow: showFullDescription ? 'auto' : 'hidden',
          }}
        >
          {activity !== 'viewPublished' ? (
            <InputTextField
              className="description"
              isTextarea
              textAreaAutoSize
              noBorder
              placeholder="Description"
              {...register('description')}
              error={formState.errors.description?.message}
            />
          ) : (
            <div key="description" className="description-text" /*  ref={descriptionRef} */>
              {currentValues.description}
            </div>
          )}
          {!showFullDescription && activity === 'viewPublished' && (
            <div className="see-more" onClick={() => setShowFullDescription(true)}>
              ...see more
            </div>
          )}
        </div>
        <div className="collection-footer" key="collection-footer"></div>
      </Card>
    </>
  )
}
