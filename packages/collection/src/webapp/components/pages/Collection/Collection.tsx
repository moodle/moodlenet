import {
  AddonItem,
  Card,
  Modal,
  PrimaryButton,
  SecondaryButton,
} from '@moodlenet/component-library'
import { MainLayout, MainLayoutProps } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { FC, useState } from 'react'
import { SchemaOf } from 'yup'
import {
  CollectionAccess,
  CollectionActions,
  Collectiondata,
  CollectionFormValues,
  CollectionState,
} from '../../../../common/types.mjs'
import {
  CollectionContributorCard,
  CollectionContributorCardProps,
} from '../../molecules/CollectionContributorCard/CollectionContributorCard.js'
import {
  MainCollectionCard,
  MainCollectionCardSlots,
} from '../../organisms/MainCollectionCard/MainCollectionCard.js'
import './Collection.scss'

export type CollectionProps = {
  mainLayoutProps: MainLayoutProps
  mainCollectionCardSlots: MainCollectionCardSlots
  collectionContributorCardProps: CollectionContributorCardProps

  wideColumnItems?: AddonItem[]
  mainColumnItems?: AddonItem[]
  sideColumnItems?: AddonItem[]
  moreButtonItems?: AddonItem[]
  extraDetailsItems?: AddonItem[]

  data: Collectiondata
  collectionForm: CollectionFormValues
  validationSchema: SchemaOf<CollectionFormValues>
  state: CollectionState
  actions: CollectionActions
  access: CollectionAccess
}

export const Collection: FC<CollectionProps> = ({
  mainLayoutProps,
  mainCollectionCardSlots,
  collectionContributorCardProps,

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
}) => {
  const { isPublished, isWaitingForApproval } = data
  const { editCollection, setIsPublished, deleteCollection } = actions
  const { isCreator, canEdit } = access

  const form = useFormik<CollectionFormValues>({
    initialValues: collectionForm,
    validationSchema: validationSchema,
    onSubmit: values => {
      return editCollection(values)
    },
  })

  const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
  const [isToDelete, setIsToDelete] = useState<boolean>(false)

  const publish = () => {
    if (form.isValid) {
      form.submitForm()
      setShouldShowErrors(false)
      setIsPublished(true)
    } else {
      setShouldShowErrors(true)
    }
  }

  const mainCollectionCard = (
    <MainCollectionCard
      key="main-collection-card"
      data={data}
      form={form}
      publish={publish}
      state={state}
      actions={actions}
      access={access}
      slots={mainCollectionCardSlots}
      shouldShowErrors={shouldShowErrors}
    />
  )

  const contributorCard = !isCreator ? (
    <CollectionContributorCard {...collectionContributorCardProps} key="contributor-card" />
  ) : null

  const editorActionsContainer = canEdit ? (
    <Card
      className="collection-action-card"
      hideBorderWhenSmall={true}
      key="editor-actions-container"
    >
      {isPublished && (
        <PrimaryButton color={'green'} style={{ pointerEvents: 'none' }}>
          Published
        </PrimaryButton>
      )}
      {!isPublished && !isWaitingForApproval /*  && !isEditing */ && (
        <PrimaryButton onClick={publish} color="green">
          Publish
        </PrimaryButton>
      )}
      {!isPublished && isWaitingForApproval && (
        <PrimaryButton disabled={true}>Publish requested</PrimaryButton>
      )}
      {isPublished || isWaitingForApproval ? (
        <SecondaryButton onClick={() => setIsPublished(false)}>Back to draft</SecondaryButton>
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

  const updatedMainColumnItems = [...(mainColumnItems ?? [])].filter(
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
