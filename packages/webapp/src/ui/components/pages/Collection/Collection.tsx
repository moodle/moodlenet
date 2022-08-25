import { t, Trans } from '@lingui/macro'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditIcon from '@material-ui/icons/Edit'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import PersonIcon from '@material-ui/icons/Person'
import SaveIcon from '@material-ui/icons/Save'
import FlagIcon from '@mui/icons-material/Flag'
import ShareIcon from '@mui/icons-material/Share'
import React, { useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { getBackupImage } from '../../../../helpers/utilities'
import { CP, withCtrl } from '../../../lib/ctrl'
import { FormikHandle } from '../../../lib/formik'
import { useImageUrl } from '../../../lib/useImageUrl'
import { AssetInfo } from '../../../types'
import Card from '../../atoms/Card/Card'
import FloatingMenu from '../../atoms/FloatingMenu/FloatingMenu'
import { InputTextField } from '../../atoms/InputTextField/InputTextField'
import Loading from '../../atoms/Loading/Loading'
import Modal from '../../atoms/Modal/Modal'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import RoundButton from '../../atoms/RoundButton/RoundButton'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import Snackbar from '../../atoms/Snackbar/Snackbar'
import TertiaryButton from '../../atoms/TertiaryButton/TertiaryButton'
import {
  VisibilityDropdown,
  VisibilityNodes,
} from '../../atoms/VisibilityDropdown/VisibilityDropdown'
import ListCard from '../../molecules/cards/ListCard/ListCard'
import {
  ResourceCard,
  ResourceCardProps,
} from '../../molecules/cards/ResourceCard/ResourceCard'
import ReportModal from '../../molecules/modals/ReportModal/ReportModal'
import SearchImage from '../../organisms/SearchImage/SearchImage'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import { NewCollectionFormValues } from '../NewCollection/types'
import {
  ContributorCard,
  ContributorCardProps,
} from './ContributorCard/ContributorCard'
import './styles.scss'

export type CollectionProps = {
  collectionId: string
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  isAuthenticated: boolean
  isOwner: boolean
  isAdmin: boolean
  numFollowers: number
  bookmarked: boolean
  contributorCardProps: ContributorCardProps
  form: FormikHandle<NewCollectionFormValues>
  resourceCardPropsList: CP<ResourceCardProps>[]
  reportForm?: FormikHandle<{ comment: string }>
  toggleBookmark: FormikHandle
  toggleFollow: FormikHandle
  deleteCollection?: FormikHandle
  isFollowing: boolean
  autoImageAdded: boolean
  canSearchImage: boolean
  collectionUrl: string
}

export const Collection = withCtrl<CollectionProps>(
  ({
    collectionId,
    headerPageTemplateProps,
    isAuthenticated,
    isOwner,
    isAdmin,
    isFollowing,
    numFollowers,
    reportForm,
    bookmarked,
    contributorCardProps,
    form,
    resourceCardPropsList,
    toggleBookmark,
    deleteCollection,
    toggleFollow,
    autoImageAdded,
    canSearchImage,
    collectionUrl,
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(
      canSearchImage && autoImageAdded
    )
    const [isToDelete, setIsToDelete] = useState<boolean>(false)
    const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
    const [isShowingImage, setisShowingImage] = useState<boolean>(false)
    const [isSearchingImage, setIsSearchingImage] = useState<boolean>(false)
    const [isReporting, setIsReporting] = useState<boolean>(false)
    const [showReportedAlert, setShowReportedAlert] = useState<boolean>(false)
    const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
    const backupImage: AssetInfo | null | undefined = useMemo(
      () => getBackupImage(collectionId),
      [collectionId]
    )
    const [imageUrl] = useImageUrl(
      form.values?.image?.location,
      backupImage?.location
    )

    const handleOnEditClick = () => {
      setIsEditing(true)
    }
    const handleOnSaveClick = () => {
      if (form.isValid) {
        form.submitForm()
        setShouldShowErrors(false)
        setIsEditing(false)
      } else {
        setShouldShowErrors(true)
      }
    }
    const background = {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
    }
    const uploadImageRef = useRef<HTMLInputElement>(null)
    const selectImage = () => {
      uploadImageRef.current?.click()
    }

    const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.currentTarget.files?.item(0)
      if (selectedFile) {
        form.setFieldValue('image', { location: selectedFile })
      }
    }

    const setImage = (image: AssetInfo | undefined) => {
      form.setFieldValue('image', image)
    }

    const deleteImage = () => {
      form.setFieldValue('image', null)
    }

    const getImageCredits = (image: AssetInfo | undefined | null) => {
      const credits = image
        ? image.credits
          ? image.credits
          : undefined
        : backupImage?.credits
      return (
        credits && (
          <div className="image-credits">
            Photo by
            <a href={credits.owner.url} target="_blank" rel="noreferrer">
              {credits.owner.name}
            </a>
            on
            {
              <a href={credits.owner.url} target="_blank" rel="noreferrer">
                {credits.provider?.name}
              </a>
            }
          </div>
        )
      )
    }

    const copyUrl = () => {
      navigator.clipboard.writeText(collectionUrl)
      setShowUrlCopiedAlert(false)
      setTimeout(() => {
        setShowUrlCopiedAlert(true)
      }, 100)
    }

    const extraDetails = (
      <Card className="extra-details-card" hideBorderWhenSmall={true}>
        {isEditing ? (
          <VisibilityDropdown
            name="visibility"
            value={form.values.visibility}
            onChange={form.handleChange}
            disabled={form.isSubmitting}
            edit={isEditing}
            label="Visibility"
            highlight={shouldShowErrors && !!form.errors.visibility}
            error={form.errors.visibility}
            position={{ top: 50, bottom: 25 }}
          />
        ) : (
          <div className="detail">
            <div className="title">
              <Trans>Visibility</Trans>
            </div>
            <abbr className="value icons">
              {VisibilityNodes[form.values.visibility]}
              {form.values.visibility}
            </abbr>
          </div>
        )}
      </Card>
    )

    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <Helmet>
          <meta property="og:title" content={form.values.title?.slice(0, 90)} />
          <meta
            property="og:description"
            content={form.values.description?.slice(0, 300)}
          />
          {imageUrl && <meta property="og:image" content={imageUrl} />}
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:image" content={imageUrl} />
        </Helmet>
        {showUrlCopiedAlert && (
          <Snackbar
            type="success"
            position="bottom"
            autoHideDuration={6000}
            showCloseButton={false}
          >
            <Trans>Copied to clipoard</Trans>
          </Snackbar>
        )}
        {isSearchingImage && (
          <SearchImage
            onClose={() => setIsSearchingImage(false)}
            setImage={setImage}
          />
        )}
        {showReportedAlert && (
          <Snackbar
            type="success"
            position="bottom"
            autoHideDuration={6000}
            showCloseButton={false}
          >
            <Trans>Reported</Trans>
          </Snackbar>
        )}
        {isReporting && reportForm && (
          <ReportModal
            reportForm={reportForm}
            title={`${t`Confirm reporting this collection`}`}
            setIsReporting={setIsReporting}
            setShowReportedAlert={setShowReportedAlert}
          />
        )}
        {isShowingImage && imageUrl && (
          <Modal
            className="image-modal"
            closeButton={false}
            onClose={() => setisShowingImage(false)}
            style={{
              maxWidth: '90%',
              maxHeight: `${!form.values.image ? 'calc(90% + 20px)' : '90%'}`,
            }}
          >
            <img src={imageUrl} alt="Cover" />
            {getImageCredits(form.values.image)}
          </Modal>
        )}
        {isToDelete && deleteCollection && (
          <Modal
            title={t`Alert`}
            actions={
              <PrimaryButton
                onClick={() => {
                  deleteCollection.submitForm()
                  setIsToDelete(false)
                }}
                color="red"
              >
                <Trans>Delete</Trans>
              </PrimaryButton>
            }
            onClose={() => setIsToDelete(false)}
            style={{ maxWidth: '400px' }}
            className="delete-message"
          >
            <Trans>The collection will be deleted</Trans>
          </Modal>
        )}
        {canSearchImage && autoImageAdded && (
          <Snackbar
            position="bottom"
            type="info"
            waitDuration={200}
            autoHideDuration={6000}
            showCloseButton={false}
          >
            <Trans>
              We found an image for you, use the search button to find a better
              one
            </Trans>
          </Snackbar>
        )}
        {form.isSubmitting && (
          <Snackbar
            position="bottom"
            type="info"
            waitDuration={200}
            autoHideDuration={6000}
            showCloseButton={false}
          >
            <Trans>Content uploading, please don't close the tab</Trans>
          </Snackbar>
        )}
        <div className="collection">
          <div className="content">
            <Card className="main-collection-card" hideBorderWhenSmall={true}>
              <div
                className={`image`}
                style={background}
                onClick={() => setisShowingImage(true)}
              >
                {isEditing && (
                  <div
                    className="image-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      ref={uploadImageRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif"
                      onChange={uploadImage}
                      hidden
                    />
                    {canSearchImage && (
                      <RoundButton
                        className={`search-image-button ${
                          form.isSubmitting ? 'disabled' : ''
                        } ${autoImageAdded ? 'highlight' : ''}`}
                        type="search"
                        abbrTitle={t`Search for an image`}
                        onClick={() => setIsSearchingImage(true)}
                      />
                    )}
                    <RoundButton
                      className={`change-image-button ${
                        form.isSubmitting ? 'disabled' : ''
                      }`}
                      type="upload"
                      abbrTitle={t`Upload and image`}
                      onClick={selectImage}
                    />
                    <RoundButton
                      className={`delete-image ${
                        form.isSubmitting ? 'disabled' : ''
                      }`}
                      type="cross"
                      abbrTitle={t`Delete image`}
                      onClick={deleteImage}
                    />
                  </div>
                )}
                {getImageCredits(form.values.image)}
              </div>
              <div className="info">
                <div className="label">
                  <Trans>Collection</Trans>
                  <div
                    className={`actions ${
                      isAdmin || isOwner ? 'edit-save' : ''
                    }`}
                  >
                    <div
                      className={`follow ${isFollowing ? 'following' : ''} ${
                        !isAuthenticated || isOwner ? 'disabled' : ''
                      }`}
                      {...(isAuthenticated && !isOwner
                        ? {
                            onClick: () => {
                              toggleFollow && toggleFollow.submitForm()
                            },
                          }
                        : {
                            onClick: (e) => {
                              e.stopPropagation()
                            },
                          })}
                    >
                      {isFollowing ? <PersonIcon /> : <PermIdentityIcon />}
                      <span>{numFollowers}</span>
                    </div>

                    {isAuthenticated && !isEditing && (
                      <div
                        className={`bookmark ${bookmarked && 'bookmarked'}`}
                        onClick={toggleBookmark.submitForm}
                      >
                        {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </div>
                    )}
                    {isAuthenticated && !isOwner && (
                      <FloatingMenu
                        className="more-button"
                        menuContent={[
                          <div tabIndex={0} onClick={copyUrl}>
                            <ShareIcon />
                            <Trans>Share</Trans>
                          </div>,
                          <div
                            tabIndex={0}
                            onClick={() => setIsReporting(true)}
                          >
                            <FlagIcon />
                            <Trans>Report</Trans>
                          </div>,
                        ]}
                        hoverElement={
                          <TertiaryButton className={`more`}>
                            ...
                          </TertiaryButton>
                        }
                      />
                    )}
                    {(isAdmin || isOwner) && isEditing && (
                      <PrimaryButton
                        className={`${form.isSubmitting ? 'loading' : ''}`}
                        color="green"
                        onClick={handleOnSaveClick}
                      >
                        <div
                          className="loading"
                          style={{
                            visibility: form.isSubmitting
                              ? 'visible'
                              : 'hidden',
                          }}
                        >
                          <Loading color="white" />
                        </div>
                        <div
                          className="label"
                          style={{
                            visibility: form.isSubmitting
                              ? 'hidden'
                              : 'visible',
                          }}
                        >
                          <SaveIcon />
                        </div>
                      </PrimaryButton>
                    )}
                    {(isAdmin || isOwner) && !isEditing && (
                      <SecondaryButton
                        onClick={handleOnEditClick}
                        color="orange"
                      >
                        <EditIcon />
                      </SecondaryButton>
                    )}
                  </div>
                </div>
                {isOwner ? (
                  <InputTextField
                    className="title underline"
                    name="title"
                    textarea
                    textAreaAutoSize
                    displayMode
                    value={form.values.title}
                    onChange={form.handleChange}
                    edit={isEditing}
                    style={{
                      pointerEvents: `${
                        form.isSubmitting ? 'none' : 'inherit'
                      }`,
                    }}
                    error={isEditing && shouldShowErrors && form.errors.title}
                  />
                ) : (
                  <div className="title">{form.values.title}</div>
                )}
                {isOwner ? (
                  <InputTextField
                    className="description underline"
                    name="description"
                    textarea
                    textAreaAutoSize
                    displayMode
                    edit={isEditing}
                    value={form.values.description}
                    onChange={form.handleChange}
                    style={{
                      pointerEvents: `${
                        form.isSubmitting ? 'none' : 'inherit'
                      }`,
                    }}
                    error={isEditing && form.errors.description}
                  />
                ) : (
                  <div className="description">{form.values.description}</div>
                )}
                {!isOwner && !isAdmin && (
                  <div className="actions">
                    <div className="left">
                      {!isOwner && !isFollowing && (
                        <PrimaryButton
                          disabled={!isAuthenticated}
                          onClick={toggleFollow.submitForm}
                          className="follow-button"
                        >
                          {/* <AddIcon /> */}
                          <Trans>Follow</Trans>
                        </PrimaryButton>
                      )}
                      {!isOwner && isFollowing && (
                        <SecondaryButton
                          disabled={!isAuthenticated}
                          onClick={toggleFollow.submitForm}
                          className="following-button"
                          color="orange"
                        >
                          {/* <CheckIcon /> */}
                          <Trans>Following</Trans>
                        </SecondaryButton>
                      )}
                    </div>
                    <div className="right">
                      {isEditing && (
                        <SecondaryButton
                          color="red"
                          onHoverColor="fill-red"
                          onClick={() => setIsToDelete(true)}
                        >
                          <DeleteOutlineIcon />
                        </SecondaryButton>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <div className="main-content">
              <div className={`main-column`}>
                <ListCard
                  content={resourceCardPropsList.map((resourceCardProps) => {
                    return (
                      <ResourceCard
                        {...resourceCardProps}
                        isEditing={isEditing}
                        allowDeletion={isOwner}
                        orientation="horizontal"
                      />
                    )
                  })}
                  className="resources no-card"
                />
                <div className="collection-footer">
                  <div className="left-column">
                    {(!isOwner || isAdmin) && (
                      <ContributorCard {...contributorCardProps} />
                    )}
                  </div>
                  <div className="right-column">
                    {(isAdmin || isOwner) && extraDetails}
                    {/*actionsCard*/}
                  </div>
                  <div className="one-column">
                    {/*actionsCard*/}
                    {(!isOwner || isAdmin) && (
                      <ContributorCard {...contributorCardProps} />
                    )}
                    {(isAdmin || isOwner) && extraDetails}
                  </div>
                </div>
              </div>
              <div className="side-column">
                {(!isOwner || isAdmin) && (
                  <ContributorCard {...contributorCardProps} />
                )}
                {(isAdmin || isOwner) && extraDetails}
                {/*actionsCard*/}
              </div>
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  }
)
