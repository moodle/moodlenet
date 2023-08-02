import type { AddonItem } from '@moodlenet/component-library'
import {
  Card,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Snackbar,
  TertiaryButton,
} from '@moodlenet/component-library'
import type { MainLayoutProps, ProxyProps } from '@moodlenet/react-app/ui'
import { MainLayout, useViewport } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import type { FC } from 'react'
import { useState } from 'react'

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
import type { MainCollectionCardSlots } from '../../organisms/MainCollectionCard/MainCollectionCard.js'
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
  isSaving: boolean
  isEditingAtStart: boolean
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
  isSaving,
  isEditingAtStart,
  validationSchemas: {
    draftCollectionValidationSchema,
    imageValidationSchema,
    publishedCollectionValidationSchema,
  },
}) => {
  const viewport = useViewport()
  const { image } = data
  const { isPublished } = state
  const { editData, deleteCollection, publish, unpublish, removeResource, setImage } = actions
  const { canPublish, canEdit } = access
  const [isEditing, setIsEditing] = useState<boolean>(isEditingAtStart)
  const [isPublishValidating, setIsPublishValidating] = useState<boolean>(isPublished)
  const [showCheckPublishSuccess, setShowCheckPublishSuccess] = useState<boolean>(false)

  const form = useFormik<CollectionFormProps>({
    initialValues: collectionForm,
    validateOnMount: true,
    validationSchema: isPublishValidating
      ? publishedCollectionValidationSchema
      : draftCollectionValidationSchema,
    validateOnChange: true,
    onSubmit: values => {
      return editData(values)
    },
  })
  const imageForm = useFormik<{ image: AssetInfoForm | null | undefined }>({
    // initialValues: useMemo(() => ({ image: image }), [image]),
    initialValues: { image },
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: imageValidationSchema,
    validateOnChange: true,
    onSubmit: values => {
      return values.image !== image && typeof values.image?.location !== 'string'
        ? setImage(values.image?.location)
        : undefined
    },
  })

  const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
  const [isToDelete, setIsToDelete] = useState<boolean>(false)

  const setFieldsAsTouched = () => {
    form.setTouched({
      title: true,
      description: true,
    })
    imageForm.setTouched({ image: true })
  }

  const checkFormAndPublish = () => {
    setFieldsAsTouched()
    // form.validateForm
    // imageForm.validateForm
    if (form.isValid && imageForm.isValid) {
      form.submitForm()
      imageForm.submitForm()
      setShouldShowErrors(false)
      publish()
    } else {
      setIsEditing(true)
      setShouldShowErrors(true)
    }
  }

  const publishCheck = () => {
    setIsPublishValidating(true)
    setFieldsAsTouched()
    if (form.isValid && imageForm.isValid) {
      setShowCheckPublishSuccess(true)
      setShouldShowErrors(false)
    } else {
      setShouldShowErrors(true)
    }
  }

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

  const mainCollectionCard = (
    <MainCollectionCard
      key="main-collection-card"
      data={data}
      // collectionForm={collectionForm}
      form={form}
      imageForm={imageForm}
      publish={checkFormAndPublish}
      state={state}
      actions={actions}
      access={access}
      slots={mainCollectionCardSlots}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      shouldShowErrors={shouldShowErrors}
      setShouldShowErrors={setShouldShowErrors}
      isSaving={isSaving}
    />
  )

  const contributorCard = isPublished ? (
    <CollectionContributorCard {...collectionContributorCardProps} key="contributor-card" />
  ) : null

  const publishButton = !isEditing && canPublish && !isPublished /*  && !isEditing */ && (
    <PrimaryButton onClick={checkFormAndPublish} color="green">
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

  const updatedExtraDetailsItems = [
    // license,
    ...(extraDetailsItems ?? []),
  ].filter((item): item is AddonItem => !!item)

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

  const isSavingSnackbar = isSaving && (
    <Snackbar
      position="bottom"
      type="info"
      waitDuration={1500}
      autoHideDuration={6000}
      showCloseButton={false}
    >
      {`Content uploading, please don't close the tab`}
    </Snackbar>
  )

  const checkPublishSnackbar = showCheckPublishSuccess && (
    <Snackbar
      position="bottom"
      type="success"
      autoHideDuration={6000}
      showCloseButton={false}
      onClose={() => setShowCheckPublishSuccess(false)}
    >
      {`Check success, save to publish`}
    </Snackbar>
  )

  const snackbars = [isSavingSnackbar, checkPublishSnackbar]

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
