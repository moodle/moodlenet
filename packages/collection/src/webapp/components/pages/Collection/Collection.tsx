import {
  AddonItem,
  Card,
  Modal,
  PrimaryButton,
  SecondaryButton,
} from '@moodlenet/component-library'
import { FormikHandle, MainLayout, MainLayoutProps } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { SchemaOf } from 'yup'
import { CollectionFormValues, CollectionType } from '../../../../common/types.mjs'
import {
  ContributorCard,
  ContributorCardProps,
} from '../../molecules/ContributorCard/ContributorCard.js'
import { ContributorCardStoryProps } from '../../molecules/ContributorCard/ContributorCard.stories.js'
import {
  MainCollectionCard,
  MainCollectionCardProps,
} from '../../organisms/MainCollectionCard/MainCollectionCard.js'
import './Collection.scss'

export type CollectionProps = {
  mainLayoutProps: MainLayoutProps
  mainCollectionCardProps: MainCollectionCardProps

  wideColumnItems?: AddonItem[]
  mainColumnItems?: AddonItem[]
  sideColumnItems?: AddonItem[]
  moreButtonItems?: AddonItem[]
  extraDetailsItems?: AddonItem[]

  collection: CollectionFormValues
  editCollection: (values: CollectionFormValues) => Promise<unknown>
  validationSchema: SchemaOf<CollectionFormValues>

  isAuthenticated: boolean
  // isApproved: boolean
  isOwner: boolean
  isAdmin: boolean
  canEdit: boolean
  // isEditing: boolean
  // setIsEditing: Dispatch<SetStateAction<boolean>>
  autoImageAdded: boolean
  // form: FormikHandle<Omit<CollectionFormValues, 'addToCollections'>>

  deleteCollection?(): unknown
  setIsPublished: Dispatch<SetStateAction<boolean>>
  isPublished: boolean
  isWaitingForApproval?: boolean
  sendToMoodleLmsForm: FormikHandle<{ site?: string }>

  // reportForm?: FormikHandle<{ comment: string }>

  // tags: FollowTag[]
  contributorCardProps: ContributorCardProps

  // licenses: SelectOptions<IconTextOptionProps>
  // setCategoryFilter(text: string): unknown
  // categories: SelectOptions<TextOptionProps>
  // setTypeFilter(text: string): unknown
  // types: SelectOptions<TextOptionProps>
  // setLevelFilter(text: string): unknown
  // levels: SelectOptions<TextOptionProps>
  // setLanguageFilter(text: string): unknown
  // languages: SelectOptions<TextOptionProps>
} & CollectionType

export const Collection: FC<CollectionProps> = ({
  mainLayoutProps,
  mainCollectionCardProps,
  wideColumnItems,
  mainColumnItems,
  sideColumnItems,
  extraDetailsItems,
  // moreButtonItems,

  collection,
  validationSchema,
  editCollection,
  deleteCollection,
  setIsPublished,

  // id: collectionId,
  // url: collectionUrl,
  // contentType,
  // licenses,
  // type,
  // collectionFormat,
  // contentUrl,
  // tags,
  numFollowers,

  isAuthenticated,
  canEdit,
  // isAdmin,
  isOwner,
  isWaitingForApproval,
  isPublished,
  // collectionUrl,
  // autoImageAdded,
}) => {
  const form = useFormik<CollectionFormValues>({
    initialValues: collection,
    validationSchema: validationSchema,
    onSubmit: values => {
      return editCollection(values)
    },
  })

  //   const [shouldShowSendToMoodleLmsError, setShouldShowSendToMoodleLmsError] =
  //     useState<boolean>(false)
  //   const [isAddingToCollection, setIsAddingToCollection] =
  //     useState<boolean>(false)
  //   const [isAddingToMoodleLms, setIsAddingToMoodleLms] =
  //     useState<boolean>(false)
  const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
  const [isToDelete, setIsToDelete] = useState<boolean>(false)
  // const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
  // const backupImage: AssetInfo | null | undefined = useMemo(
  //   () => getBackupImage(collectionId),
  //   [collectionId],
  // )
  //   const [isReporting, setIsReporting] = useState<boolean>(false)
  //   const [showReportedAlert, setShowReportedAlert] = useState<boolean>(false)
  // const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  // const [isEditing, setIsEditing] = useReducer(_ => !_, false)

  // const [imageUrl] = useImageUrl(form.values?.image?.location, backupImage?.location)

  const mainCollectionCard = {
    Item: () => (
      <MainCollectionCard
        {...mainCollectionCardProps}
        isOwner={isOwner}
        isPublished={isPublished}
        setIsPublished={setIsPublished}
        isWaitingForApproval={isWaitingForApproval}
        isAuthenticated={isAuthenticated}
        numFollowers={numFollowers}
        // isEditing={isEditing}
        // setIsEditing={setIsEditing}
        canEdit={canEdit}
        form={form}
        shouldShowErrors={shouldShowErrors}
        publish={publish}
      />
    ),
    key: 'main-collection-card',
  }

  const contributorCard = {
    Item: () => (!isOwner ? <ContributorCard {...ContributorCardStoryProps} /> : <></>),
    key: 'contributor-card',
  }

  const publish = () => {
    if (form.isValid) {
      form.submitForm()
      setShouldShowErrors(false)
      setIsPublished(true)
    } else {
      setShouldShowErrors(true)
    }
  }

  const editorActionsContainer = {
    Item: () =>
      canEdit ? (
        <Card className="collection-action-card" hideBorderWhenSmall={true}>
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
      ) : (
        <></>
      ),
    key: 'editor-actions-container',
  }

  // const license: AddonItem | null =
  //   contentType === 'file'
  //     ? {
  //         Item: () => (
  //           <Dropdown
  //             name="license"
  //             className="license-dropdown"
  //             onChange={form.handleChange}
  //             value={form.values.license}
  //             label={`License`}
  //             edit
  //             highlight={shouldShowErrors && !!form.errors.license}
  //             disabled={form.isSubmitting}
  //             error={form.errors.license}
  //             position={{ top: 50, bottom: 25 }}
  //             pills={
  //               licenses.selected && (
  //                 <IconPill key={licenses.selected.value} icon={licenses.selected.icon} />
  //               )
  //             }
  //           >
  //             {licenses.opts.map(({ icon, label, value }) => (
  //               <IconTextOption icon={icon} label={label} value={value} key={value} />
  //             ))}
  //           </Dropdown>
  //         ),
  //         key: 'extra-details-card',
  //       }
  //     : null

  const updatedExtraDetailsItems = [
    // license,
    ...(extraDetailsItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const extraDetailsContainer = {
    Item: () =>
      updatedExtraDetailsItems.length > 0 ? (
        <Card className="extra-details-card" hideBorderWhenSmall={true}>
          {updatedExtraDetailsItems.map(i => (
            <i.Item key={i.key} />
          ))}
        </Card>
      ) : (
        <></>
      ),
    key: 'extra-edtails-container',
  }

  const updatedSideColumnItems = [
    contributorCard,
    editorActionsContainer,
    extraDetailsContainer,
    ...(sideColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const updatedMainColumnItems = [mainCollectionCard, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const updatedWideColumnItems = [mainCollectionCard, ...(wideColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const snackbars = <></>

  const modals = (
    <>
      {isToDelete && deleteCollection && (
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
            {updatedWideColumnItems.map(i => (
              <i.Item key={i.key} />
            ))}
          </div>
          <div className="main-and-side-columns">
            <div className="main-column">
              {updatedMainColumnItems.map(i => (
                <i.Item key={i.key} />
              ))}
            </div>
            <div className="side-column">
              {updatedSideColumnItems?.map(i => (
                <i.Item key={i.key} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
Collection.displayName = 'CollectionPage'
export default Collection
