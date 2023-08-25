import type { AddonItem } from '@moodlenet/component-library'
import {
  Card,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Snackbar,
  SnackbarStack,
  TertiaryButton,
} from '@moodlenet/component-library'
import type { MainLayoutProps, ProxyProps } from '@moodlenet/react-app/ui'
import { MainLayout, useViewport } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { AssetInfoForm } from '@moodlenet/component-library/common'
import type { ResourceCardPropsData } from '@moodlenet/ed-resource/ui'
import { ResourceCard } from '@moodlenet/ed-resource/ui'
import { CloseRounded } from '@mui/icons-material'
import type {
  CollectionAccessProps,
  CollectionActions,
  CollectionDataProps,
  CollectionFormProps,
  CollectionStateProps,
} from '../../../../common/types.mjs'
import type { ValidationSchemas } from '../../../../common/validationSchema.mjs'
import type { CollectionContributorCardProps } from '../../molecules/CollectionContributorCard/CollectionContributorCard.js'
import { CollectionContributorCard } from '../../molecules/CollectionContributorCard/CollectionContributorCard.js'
import type {
  MainCollectionCardSlots,
  ValidForms,
} from '../../organisms/MainCollectionCard/MainCollectionCard.js'
import { MainCollectionCard } from '../../organisms/MainCollectionCard/MainCollectionCard.js'
import './Collection.scss'

export type CollectionProps = {
  mainLayoutProps: MainLayoutProps
  mainCollectionCardSlots: MainCollectionCardSlots
  collectionContributorCardProps: CollectionContributorCardProps
  resourceCardPropsList: { key: string; props: ProxyProps<ResourceCardPropsData> }[]

  wideColumnItems: AddonItem[]
  mainColumnItems: AddonItem[]
  rightColumnItems: AddonItem[]

  extraDetailsItems: AddonItem[]

  data: CollectionDataProps
  collectionForm: CollectionFormProps
  state: CollectionStateProps
  actions: CollectionActions
  access: CollectionAccessProps
  validationSchemas: ValidationSchemas
}

export const Collection: FC<CollectionProps> = ({
  mainLayoutProps,
  mainCollectionCardSlots,
  collectionContributorCardProps,
  resourceCardPropsList,

  wideColumnItems,
  mainColumnItems,
  rightColumnItems,

  extraDetailsItems,

  data,
  collectionForm,
  state,
  actions,
  access,

  validationSchemas: {
    draftCollectionValidationSchema,
    imageValidationSchema,
    publishedCollectionValidationSchema,
  },
}) => {
  const viewport = useViewport()
  const { image } = data
  const { isPublished } = state
  const {
    editData,
    deleteCollection,
    publish,
    unpublish: setUnpublish,
    removeResource,
    setImage,
  } = actions
  const { canPublish, canEdit } = access

  const [emptyOnStart, setEmptyOnStart] = useState<boolean>(
    !collectionForm.title && !collectionForm.description && !image,
  )
  const [isEditing, setIsEditing] = useState<boolean>(emptyOnStart)
  const [isPublishValidating, setIsPublishValidating] = useState<boolean>(isPublished)
  const [showCheckPublishSuccess, setShowCheckPublishSuccess] = useState<boolean>(false)
  const [showPublishSuccess, setShowPublishSuccess] = useState<boolean>(false)
  const [showUnpublishSuccess, setShowUnpublishSuccess] = useState<boolean>(false)
  const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
  const [isToDelete, setIsToDelete] = useState<boolean>(false)

  const prevIsPublishedRef = useRef(isPublished)

  useEffect(() => {
    if (prevIsPublishedRef.current === false && isPublished === true) {
      setShowPublishSuccess(true)
    }
    if (prevIsPublishedRef.current === true && isPublished === false) {
      setShowUnpublishSuccess(true)
    }
    prevIsPublishedRef.current = isPublished
  }, [isPublished])

  const form = useFormik<CollectionFormProps>({
    initialValues: collectionForm,
    validateOnMount: true,
    enableReinitialize: true,
    validationSchema: isPublishValidating
      ? publishedCollectionValidationSchema
      : draftCollectionValidationSchema,
    onSubmit: values => {
      return editData(values)
    },
  })
  const isPublishedFormValid = publishedCollectionValidationSchema.isValidSync(form.values)
  const isDraftFormValid = draftCollectionValidationSchema.isValidSync(form.values)

  const imageForm = useFormik<{ image: AssetInfoForm | null | undefined }>({
    initialValues: useMemo(() => ({ image: image }), [image]),
    validateOnMount: true,
    enableReinitialize: true,
    validationSchema: imageValidationSchema,
    onSubmit: values => {
      return values.image !== image && typeof values.image?.location !== 'string'
        ? setImage(values.image?.location)
        : undefined
    },
  })

  const isImageValid = imageValidationSchema.isValidSync(imageForm.values)

  const imageForm_setTouched = imageForm.setTouched
  const form_setTouched = form.setTouched

  const setFieldsAsTouched = useCallback(() => {
    form_setTouched({
      title: true,
      description: true,
    })
    imageForm_setTouched({ image: true })
  }, [form_setTouched, imageForm_setTouched])

  const imageForm_validateForm = imageForm.validateForm
  const form_validateForm = form.validateForm

  const [isCheckingAndPublishing, setIsCheckingAndPublishing] = useState<boolean>(false)

  const checkFormsAndPublish = () => {
    setIsPublishValidating(true)
    setIsCheckingAndPublishing(true)
    applyCheckFormsAndPublish()
  }

  const applyCheckFormsAndPublish = useCallback(() => {
    setFieldsAsTouched()
    imageForm_validateForm()

    if (isPublishedFormValid && imageForm.isValid) {
      form_validateForm()
      setShouldShowErrors(false)
      publish()
    } else {
      setIsEditing(true)
      setShouldShowErrors(true)
    }
  }, [
    form_validateForm,
    imageForm.isValid,
    imageForm_validateForm,
    isPublishedFormValid,
    publish,
    setFieldsAsTouched,
  ])

  useEffect(() => {
    if (isCheckingAndPublishing) {
      applyCheckFormsAndPublish()
      setIsCheckingAndPublishing(false)
    }
  }, [isCheckingAndPublishing, applyCheckFormsAndPublish])

  const [isPublishChecking, setIsPublishChecking] = useState<boolean>(false)

  const publishCheck = () => {
    setIsPublishValidating(true)
    setIsPublishChecking(true)
  }

  const applyPublishCheck = useCallback(() => {
    setFieldsAsTouched()
    imageForm_validateForm()

    if (isPublishedFormValid && imageForm.isValid) {
      setShowCheckPublishSuccess(true)
      setShouldShowErrors(false)
    } else {
      form_validateForm()
      setShouldShowErrors(true)
    }
  }, [
    form_validateForm,
    imageForm.isValid,
    imageForm_validateForm,
    isPublishedFormValid,
    setFieldsAsTouched,
  ])

  useEffect(() => {
    if (isPublishChecking) {
      applyPublishCheck()
      setIsPublishChecking(false)
    }
  }, [isPublishChecking, applyPublishCheck])

  const resourceList = (
    <div className="resource-list">
      {resourceCardPropsList.map(({ key, props }) => (
        <ResourceCard
          {...props}
          orientation={'horizontal'}
          key={key}
          topRightItems={[
            canEdit && isEditing
              ? {
                  Item: () => (
                    <TertiaryButton onClick={() => removeResource(key)} className="delete">
                      <CloseRounded />
                    </TertiaryButton>
                  ),
                  key: 'remove-resource-button',
                }
              : null,
          ]}
        />
      ))}
    </div>
  )

  const unpublish = () => {
    setIsPublishValidating(false)
    setShouldShowErrors(false)
    setUnpublish()
  }

  const isFormValid: ValidForms = {
    isDraftFormValid: isDraftFormValid,
    isPublishedFormValid: isPublishedFormValid,
    isImageValid: isImageValid,
  }

  const mainCollectionCard = (
    <MainCollectionCard
      key="main-collection-card"
      data={data}
      form={form}
      imageForm={imageForm}
      publish={checkFormsAndPublish}
      publishCheck={publishCheck}
      state={state}
      actions={actions}
      access={access}
      slots={mainCollectionCardSlots}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      setIsPublishValidating={setIsPublishValidating}
      emptyOnStart={emptyOnStart}
      setEmptyOnStart={setEmptyOnStart}
      isFormValid={isFormValid}
      setFieldsAsTouched={setFieldsAsTouched}
      shouldShowErrors={shouldShowErrors}
      setShouldShowErrors={setShouldShowErrors}
    />
  )

  const contributorCard = isPublished ? (
    <CollectionContributorCard {...collectionContributorCardProps} key="contributor-card" />
  ) : null

  const publishButton = !isEditing && canPublish && !isPublished /*  && !isEditing */ && (
    <PrimaryButton onClick={checkFormsAndPublish} color="green">
      Publish
    </PrimaryButton>
  )

  const publishCheckButton = isEditing && canPublish && !isPublished /*  && !isEditing */ && (
    <PrimaryButton onClick={publishCheck} color="green">
      Publish check
    </PrimaryButton>
  )

  const unpublishButton =
    canPublish && isPublished ? (
      <SecondaryButton onClick={unpublish}>Unpublish</SecondaryButton>
    ) : null

  const editorActionsContainer = canPublish ? (
    <Card
      className="collection-action-card"
      hideBorderWhenSmall={true}
      key="editor-actions-container"
    >
      {publishButton}
      {publishCheckButton}
      {unpublishButton}
    </Card>
  ) : null

  const updatedExtraDetailsItems = [...(extraDetailsItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const extraDetailsContainer =
    updatedExtraDetailsItems.length > 0 ? (
      <Card className="extra-details-card" key="extra-details-container" hideBorderWhenSmall={true}>
        {updatedExtraDetailsItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </Card>
    ) : null

  const updatedWideColumnItems = [
    mainCollectionCard,
    viewport.screen.medium && resourceList,
    ...(wideColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const updatedMainColumnItems = [
    !viewport.screen.medium && resourceList,
    !viewport.screen.big && contributorCard,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const updatedRightColumnItems = [
    viewport.screen.big && contributorCard,
    editorActionsContainer,
    extraDetailsContainer,
    ...(rightColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const checkPublishSnackbar = showCheckPublishSuccess ? (
    <Snackbar
      position="bottom"
      type="success"
      autoHideDuration={4000}
      showCloseButton={false}
      onClose={() => setShowCheckPublishSuccess(false)}
    >
      {`Success, save before publishing`}
    </Snackbar>
  ) : null

  const publishSnackbar = showPublishSuccess ? (
    <Snackbar
      position="bottom"
      type="success"
      autoHideDuration={4000}
      showCloseButton={false}
      onClose={() => setShowPublishSuccess(false)}
    >
      {`Collection published`}
    </Snackbar>
  ) : null

  const unpublishSnackbar = showUnpublishSuccess ? (
    <Snackbar
      position="bottom"
      type="success"
      autoHideDuration={4000}
      showCloseButton={false}
      onClose={() => setShowUnpublishSuccess(false)}
    >
      {`Collection unpublished`}
    </Snackbar>
  ) : null

  const snackbars = (
    <SnackbarStack snackbarList={[checkPublishSnackbar, publishSnackbar, unpublishSnackbar]} />
  )

  const modals = (
    <>
      {isToDelete && (
        <Modal
          title={`Alert`}
          actions={
            <PrimaryButton
              onClick={() => {
                deleteCollection()
                setIsToDelete(false)
              }}
              color="red"
            >
              Delete
            </PrimaryButton>
          }
          onClose={() => setIsToDelete(false)}
          style={{ maxWidth: '400px' }}
          className="delete-message"
        >
          The collection will be deleted
        </Modal>
      )}
    </>
  )
  return (
    <MainLayout {...mainLayoutProps}>
      {modals}
      {snackbars}
      <div className="collection">
        <div className="content">
          {updatedWideColumnItems.length > 0 && (
            <div className="wide-column">
              {updatedWideColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
            </div>
          )}
          {(updatedMainColumnItems.length > 0 || updatedRightColumnItems.length > 0) && (
            <div className="main-and-right-columns">
              {updatedMainColumnItems.length > 0 && (
                <div className="main-column">
                  {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
                </div>
              )}
              {updatedRightColumnItems.length > 0 && (
                <div className="right-column">
                  {updatedRightColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
Collection.displayName = 'CollectionPage'
export default Collection
