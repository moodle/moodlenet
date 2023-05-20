import type { AddonItem } from '@moodlenet/component-library'
import { Card, Modal, PrimaryButton, SecondaryButton } from '@moodlenet/component-library'
import type { MainLayoutProps, ProxyProps } from '@moodlenet/react-app/ui'
import { MainLayout } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import type { SchemaOf } from 'yup'

import type { ResourceCardPropsData } from '@moodlenet/ed-resource/ui'
import { ResourceCard } from '@moodlenet/ed-resource/ui'
import type {
  CollectionAccessProps,
  CollectionActions,
  CollectionDataProps,
  CollectionFormProps,
  CollectionStateProps,
} from '../../../../common/types.mjs'
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
  sideColumnItems: AddonItem[]
  moreButtonItems: AddonItem[]
  extraDetailsItems: AddonItem[]

  data: CollectionDataProps
  collectionForm: CollectionFormProps
  validationSchema: SchemaOf<CollectionFormProps>
  state: CollectionStateProps
  actions: CollectionActions
  access: CollectionAccessProps
  isSaving: boolean
}

export const Collection: FC<CollectionProps> = ({
  mainLayoutProps,
  mainCollectionCardSlots,
  collectionContributorCardProps,
  resourceCardPropsList,

  wideColumnItems,
  mainColumnItems,
  sideColumnItems,
  extraDetailsItems,

  data,
  collectionForm,
  validationSchema,
  state,
  actions,
  access,
  isSaving,
}) => {
  const { imageUrl } = data
  const { isPublished } = state
  const { editData, deleteCollection, publish, unpublish } = actions
  const { canPublish } = access
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(imageUrl)

  const form = useFormik<CollectionFormProps>({
    initialValues: collectionForm,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: values => {
      return editData(values)
    },
  })

  useEffect(() => {
    if (form.dirty) {
      editData(form.values)
    }
  }, [form.values, form.dirty, editData])

  useEffect(() => {
    setCurrentImageUrl(imageUrl)
  }, [imageUrl])

  const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
  const [isToDelete, setIsToDelete] = useState<boolean>(false)

  const checkFormAndPublish = () => {
    if (form.isValid) {
      form.submitForm()
      setShouldShowErrors(false)
      publish()
    } else {
      setShouldShowErrors(true)
    }
  }
  const resourceList = resourceCardPropsList.map(({ key, props }) => (
    <ResourceCard {...props} orientation={'horizontal'} key={key} />
  ))

  const mainCollectionCard = (
    <MainCollectionCard
      key="main-collection-card"
      data={{ ...data, imageUrl: currentImageUrl }}
      form={form}
      publish={checkFormAndPublish}
      state={state}
      actions={actions}
      access={access}
      slots={mainCollectionCardSlots}
      shouldShowErrors={shouldShowErrors}
      isSaving={isSaving}
    />
  )

  const contributorCard = isPublished ? (
    <CollectionContributorCard {...collectionContributorCardProps} key="contributor-card" />
  ) : null

  const editorActionsContainer = canPublish ? (
    <Card
      className="collection-action-card"
      hideBorderWhenSmall={true}
      key="editor-actions-container"
    >
      {/* {isPublished && (
        <PrimaryButton color={'green'} style={{ pointerEvents: 'none' }}>
          Published
        </PrimaryButton>
      )} */}
      {canPublish && !isPublished /*  && !isEditing */ && (
        <PrimaryButton onClick={checkFormAndPublish} color="green">
          Publish
        </PrimaryButton>
      )}

      {canPublish && isPublished ? (
        <SecondaryButton onClick={unpublish}>Unpublish</SecondaryButton>
      ) : (
        <></>
      )}
    </Card>
  ) : null

  const updatedExtraDetailsItems = [
    // license,
    ...(extraDetailsItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const extraDetailsContainer =
    updatedExtraDetailsItems.length > 0 ? (
      <Card className="extra-details-card" key="extra-edtails-container" hideBorderWhenSmall={true}>
        {updatedExtraDetailsItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </Card>
    ) : null

  const updatedSideColumnItems = [
    contributorCard,
    editorActionsContainer,
    extraDetailsContainer,
    ...(sideColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const updatedWideColumnItems = [mainCollectionCard, ...(wideColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const updatedMainColumnItems = [resourceList, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const snackbars = <></>

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
          <div className="wide-column">
            {updatedWideColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
          </div>
          <div className="main-and-side-columns">
            <div className="main-column">
              {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
            </div>
            <div className="side-column">
              {updatedSideColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
Collection.displayName = 'CollectionPage'
export default Collection
