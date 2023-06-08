import { Share } from '@material-ui/icons'
import type { AddonItem, FloatingMenuContentElementItem } from '@moodlenet/component-library'
import {
  Card,
  FloatingMenu,
  InputTextField,
  Modal,
  PrimaryButton,
  Snackbar,
  TertiaryButton,
} from '@moodlenet/component-library'
import type { FormikHandle } from '@moodlenet/react-app/ui'
import { getBackupImage, ReportModal, useImageUrl } from '@moodlenet/react-app/ui'
import {
  CloudDoneOutlined,
  Delete,
  Flag,
  MoreVert,
  Public,
  PublicOff,
  Sync,
} from '@mui/icons-material'
import { useFormik } from 'formik'
import type { FC } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  CollectionAccessProps,
  CollectionActions,
  CollectionDataProps,
  CollectionFormProps,
  CollectionStateProps,
} from '../../../../common/types.mjs'
import { UploadImage } from '../UploadImage/UploadImage.js'
import './MainCollectionCard.scss'

export type MainCollectionCardSlots = {
  mainColumnItems: (AddonItem | null)[]
  headerColumnItems: (AddonItem | null)[]
  topLeftHeaderItems: (AddonItem | null)[]
  topRightHeaderItems: (AddonItem | null)[]
  moreButtonItems: (FloatingMenuContentElementItem | null)[]
  footerRowItems: (AddonItem | null)[]
}

export type MainCollectionCardProps = {
  slots: MainCollectionCardSlots

  data: CollectionDataProps
  form: FormikHandle<CollectionFormProps>

  state: CollectionStateProps
  actions: CollectionActions
  access: CollectionAccessProps

  shouldShowErrors: boolean
  publish: () => void
  isSaving: boolean
}

export const MainCollectionCard: FC<MainCollectionCardProps> = ({
  slots,

  data,
  form,

  state,
  actions,
  access,

  shouldShowErrors,
  publish,
  isSaving,
}) => {
  const {
    mainColumnItems,
    headerColumnItems,
    topLeftHeaderItems,
    topRightHeaderItems,
    moreButtonItems,
    footerRowItems,
  } = slots

  const { id, mnUrl, imageUrl } = data

  const { isPublished } = state

  const { unpublish, deleteCollection, setImage, reportCollection } = actions
  const { canPublish, canDelete, canEdit, canReport } = access

  const imageForm = useFormik<{ image: File | string | null | undefined }>({
    initialValues: { image: imageUrl },
    // validationSchema: validationSchema //@ALE for some reason this validation is avoidind the onSubmit, I tried to investigate but couldn't find a reason
    onSubmit: values => {
      return typeof values.image !== 'string' ? setImage(values.image) : undefined
    },
  })

  const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  const [isToDelete, setIsToDelete] = useState<boolean>(false)
  const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
  const [updatedImage, setUpdatedImage] = useState<string | undefined>(imageUrl)
  const backupImage: string | undefined = useMemo(() => getBackupImage(id), [id])
  const [image] = useImageUrl(imageUrl, backupImage)
  const [imageFromForm] = useImageUrl(imageForm.values.image)
  const [isReporting, setIsReporting] = useState<boolean>(false)

  useEffect(() => {
    setUpdatedImage(imageUrl)
  }, [imageUrl])

  useEffect(() => {
    setUpdatedImage(imageFromForm)
  }, [imageFromForm])

  const copyUrl = () => {
    navigator.clipboard.writeText(mnUrl)
    setShowUrlCopiedAlert(false)
    setTimeout(() => {
      setShowUrlCopiedAlert(true)
    }, 100)
  }

  const title = canEdit ? (
    <InputTextField
      name="title"
      isTextarea
      textAreaAutoSize
      className="title underline"
      value={form.values.title}
      placeholder="Title"
      key="title"
      noBorder
      onChange={form.handleChange}
      style={{
        pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
      }}
      error={shouldShowErrors && form.errors.title}
    />
  ) : (
    <div className="title" key="title">
      {form.values.title}
    </div>
  )

  //   const tagsDiv: AddonItem = {
  //     Item: () =>
  //       tags.length > 0 ? <div className="tags scroll">{getTagList(tags, 'medium')}</div> : <></>,
  //     key: 'type-and-actions',
  //   }

  const collectionLabel = (
    <div className="collection-label" key="collection-label">
      Collection
    </div>
  )

  const [showSavedText, setShowSavedText] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    isSaving && setSaved(true)
    if (!isSaving && saved) {
      setShowSavedText(true)
      setTimeout(() => setShowSavedText(false), 3000)
    }
  }, [isSaving, setShowSavedText, saved])

  const savingFeedback = isSaving ? (
    <abbr className="saving-feedback" key="saving-feedback" title="Saving">
      <Sync />
      Saving...
    </abbr>
  ) : saved ? (
    <abbr className="saved-feedback" key="saved-feedback" title="Saved">
      <CloudDoneOutlined />
      {showSavedText && 'Saved'}
    </abbr>
  ) : null

  const updatedTopLeftHeaderItems = [
    collectionLabel,
    savingFeedback,
    ...(topLeftHeaderItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const empty = !form.values.title && !form.values.description && !imageForm.values.image

  const shareButton: FloatingMenuContentElementItem | null = isPublished
    ? {
        Element: (
          <div key="share-button" onClick={copyUrl}>
            <Share />
            Share
          </div>
        ),
      }
    : null

  const reportButton: FloatingMenuContentElementItem | null =
    !empty && isPublished && canReport
      ? {
          Element: (
            <div key={'report-button'} tabIndex={0} onClick={() => setIsReporting(true)}>
              <Flag />
              Report
            </div>
          ),
        }
      : null

  const deleteButton: FloatingMenuContentElementItem | null =
    !empty && canDelete
      ? {
          Element: (
            <div key="delete-button" onClick={() => setIsToDelete(true)}>
              <Delete />
              Delete
            </div>
          ),
        }
      : null

  const unpublishButton: FloatingMenuContentElementItem | null =
    canPublish && isPublished
      ? {
          Element: (
            <div key="unpublish-button" onClick={unpublish}>
              <PublicOff />
              Unpublish
            </div>
          ),
        }
      : null

  const publishButton: FloatingMenuContentElementItem | null =
    canPublish && !isPublished
      ? {
          Element: (
            <div key="publish-button" onClick={publish}>
              <Public style={{ fill: '#00bd7e' }} />
              Publish
            </div>
          ),
        }
      : null

  const publishedButton =
    canEdit && isPublished ? (
      <abbr title="Published" key="publishing-button" style={{ cursor: 'initial' }}>
        <Public style={{ fill: '#00bd7e' }} />
      </abbr>
    ) : null

  const unpublishedButton =
    canEdit && !isPublished ? (
      <abbr title="Unpublished" key="unpublished-button" style={{ cursor: 'initial' }}>
        <PublicOff style={{ fill: '#a7a7a7' }} />
      </abbr>
    ) : null

  const updatedMoreButtonItems = [
    publishButton,
    unpublishButton,
    shareButton,
    reportButton,
    deleteButton,
    ...(moreButtonItems ?? []),
  ].filter((item): item is FloatingMenuContentElementItem => !!item)

  const moreButton =
    updatedMoreButtonItems.length > 0 ? (
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
    null

  const updatedTopRightHeaderItems = [
    publishedButton,
    unpublishedButton,
    ...(topRightHeaderItems ?? []),
    moreButton,
  ].filter((item): item is AddonItem => !!item)

  const topHeaderRow = (
    <div className="top-header-row" key="top-header-row">
      <div className="top-left-header">
        {updatedTopLeftHeaderItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
      <div className="top-right-header">
        {updatedTopRightHeaderItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    </div>
  )

  const updatedHeaderColumnItems = [
    topHeaderRow,
    title,
    // tagsDiv,
    ...(headerColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const collectionHeader = (
    <div className="collection-header" key="collection-header">
      {updatedHeaderColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </div>
  )

  const collectionUploader = canEdit ? (
    <UploadImage
      imageForm={imageForm}
      imageUrl={updatedImage}
      imageOnClick={() => setIsShowingImage(true)}
      key="collection-uploader"
    />
  ) : null

  const imageDiv = (
    <div
      className="image"
      onClick={() => setIsShowingImage(true)}
      // style={{ maxHeight: form.values.image ? 'fit-content' : '150px' }}
      style={{ backgroundImage: `url(${image})` }}
    />
  )

  const imageContainer = !canEdit ? (
    imageForm.values.image || imageUrl ? (
      <div className="image-container" key="image-container">
        {imageDiv}
      </div>
    ) : null
  ) : null

  const descriptionEditRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)

  const [alwaysFullDescription, setAlwaysFullDescription] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(true)

  useEffect(() => {
    const fieldElem = descriptionRef.current ?? descriptionEditRef.current
    if (fieldElem) {
      canEdit && fieldElem.scrollHeight < 80 && setAlwaysFullDescription(true)
      setShowFullDescription(canEdit || alwaysFullDescription || fieldElem.scrollHeight < 80)
    }
  }, [
    descriptionRef.current?.scrollHeight,
    descriptionEditRef.current?.scrollHeight,
    alwaysFullDescription,
    canEdit,
  ])

  const description = (
    <div
      className="description-container"
      key="description-container"
      style={{
        pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
        height: showFullDescription ? 'fit-content' : '66px',
        overflow: showFullDescription ? 'auto' : 'hidden',
      }}
    >
      {canEdit ? (
        <InputTextField
          className="description underline"
          name="description"
          isTextarea
          ref={descriptionEditRef}
          textAreaAutoSize
          noBorder
          key="description"
          placeholder="Description"
          value={form.values.description}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.description}
        />
      ) : (
        <div
          key="description"
          className="description-text"
          ref={descriptionRef}
          // style={{
          //   height: showFullDescription ? 'fit-content' : '66px',
          //   overflow: showFullDescription ? 'auto' : 'hidden',
          //   // paddingBottom: showFullDescription && !isSmallDescription ? '20px' : 0,
          // }}
        >
          {form.values.description}
        </div>
      )}
      {!showFullDescription && !canEdit && (
        <div className="see-more" onClick={() => setShowFullDescription(true)}>
          ...see more
        </div>
      )}
    </div>
  )

  const updatedFooterRowItems = [...(footerRowItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const collectionFooter =
    updatedFooterRowItems.length > 0 ? (
      <div className="collection-footer" key="collection-footer">
        {updatedFooterRowItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    ) : null

  const updatedMainColumnItems = [
    imageContainer,
    collectionUploader,
    collectionHeader,
    description,
    collectionFooter,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const snackbars = (
    <>
      {showUrlCopiedAlert && (
        <Snackbar type="success" position="bottom" autoHideDuration={6000} showCloseButton={false}>
          Copied to clipoard
        </Snackbar>
      )}
    </>
  )

  const modals = [
    isShowingImage && (
      <Modal
        className="image-modal"
        closeButton={false}
        onClose={() => setIsShowingImage(false)}
        style={{
          maxWidth: '90%',
          maxHeight: '90%',
          // maxHeight: form.values.type !== '' ? 'calc(90% + 20px)' : '90%',
        }}
      >
        <img src={updatedImage ?? image} alt="Collection" />
        {/* {getImageCredits(form.values.image)} */}
      </Modal>
    ),
    isToDelete && deleteCollection && (
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
    ),
    isReporting && (
      <ReportModal
        report={reportCollection}
        title={`${`Confirm reporting this collection`}`}
        setIsReporting={setIsReporting}
      />
    ),
  ]
  return (
    <>
      {modals}
      {snackbars}
      {/* {searchImageComponent} */}
      <Card className="main-collection-card" hideBorderWhenSmall={true}>
        {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </Card>
    </>
  )
}
MainCollectionCard.displayName = 'MainCollectionCard'
export default MainCollectionCard
