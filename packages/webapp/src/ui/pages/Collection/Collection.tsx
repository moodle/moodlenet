import { Trans } from '@lingui/macro'
import { default as BookmarkBorderIcon, default as BookmarkIcon } from '@material-ui/icons/BookmarkBorder'
import EditIcon from '@material-ui/icons/Edit'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import SaveIcon from '@material-ui/icons/Save'
import { useCallback, useState } from 'react'
import Card from '../../components/atoms/Card/Card'
import Dropdown from '../../components/atoms/Dropdown/Dropdown'
import InputTextField from '../../components/atoms/InputTextField/InputTextField'
import PrimaryButton from '../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton'
import ListCard from '../../components/cards/ListCard/ListCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import { CP, withCtrl } from '../../lib/ctrl'
import { FormikBag } from '../../lib/formik'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { DropdownField } from '../NewCollection/FieldsData'
import { NewCollectionFormValues } from '../NewCollection/types'
import { ContributorCard, ContributorCardProps } from './ContributorCard/ContributorCard'
import './styles.scss'

export type CollectionProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  isAuthenticated: boolean
  isOwner: boolean
  numFollowers: number
  bookmarked: boolean
  contributorCardProps: ContributorCardProps
  formBag: FormikBag<NewCollectionFormValues>
  categories: DropdownField
  resourceCardPropsList: CP<ResourceCardProps>[]
  updateCollection: () => unknown
  toggleBookmark: () => unknown
  toggleFollow: () => unknown
  deleteCollection?: () => unknown
  following: boolean
}

export const Collection = withCtrl<CollectionProps>(
  ({
    headerPageTemplateProps,
    isAuthenticated,
    isOwner,
    following,
    numFollowers,
    bookmarked,
    contributorCardProps,
    formBag,
    categories,
    resourceCardPropsList,
    toggleBookmark,
    updateCollection,
    deleteCollection,
    toggleFollow,
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const handleOnEditClick = () => {
      setIsEditing(true)
    }
    const handleOnSaveClick = () => {
      updateCollection()
      setIsEditing(false)
    }

    const actionsCard = (
      <Card className="collection-actions-card" hideBorderWhenSmall={true}>
        {/*         <PrimaryButton disabled={!isAuthenticated}>
          <Trans>Send all to Moodle</Trans>
        </PrimaryButton> */}
        <SecondaryButton disabled={!isAuthenticated}>
          <Trans>Suggest Resource</Trans>
        </SecondaryButton>
      </Card>
    )

    const [form, formAttrs] = formBag
    const setFieldValue = form.setFieldValue
    const setTitleField = useCallback((_: string) => setFieldValue('title', _), [setFieldValue])
    const setDescriptionField = useCallback((_: string) => setFieldValue('description', _), [setFieldValue])
    const setCategoryField = useCallback((_: string) => setFieldValue('category', _), [setFieldValue])
    const background = {
      backgroundImage: 'url(' + form.values.image + ')',
      backgroundSize: 'cover',
    }
    const extraDetails = (
      <Card className="extra-details-card" hideBorderWhenSmall={true}>
        <Dropdown
          value={form.values.category}
          {...categories}
          {...formAttrs.category}
          displayMode={true}
          edit={isEditing}
          getValue={setCategoryField}
        />
        {isEditing && (
          <SecondaryButton color="red" onHoverColor="filled-red" onClick={deleteCollection}>
            <Trans>Delete Collection</Trans>
          </SecondaryButton>
        )}
      </Card>
    )

    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="collection">
          <div className="content">
            <Card className="main-collection-card" hideBorderWhenSmall={true}>
              <div className="image" style={background} />
              <div className="info">
                <div className="label">
                  <Trans>Collection</Trans>
                  {!isOwner ? (
                    <div className="actions">
                      {isAuthenticated && (
                        <div className={`bookmark ${bookmarked && 'bookmarked'}`} onClick={toggleBookmark}>
                          {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="actions edit-save">
                      {isEditing ? (
                        <PrimaryButton color="green" onHoverColor="orange" onClick={handleOnSaveClick}>
                          <SaveIcon />
                        </PrimaryButton>
                      ) : (
                        <SecondaryButton onClick={handleOnEditClick} color="orange">
                          <EditIcon />
                        </SecondaryButton>
                      )}
                    </div>
                  )}
                </div>
                {isOwner ? (
                  <InputTextField
                    className="title"
                    autoUpdate={true}
                    value={form.values.title}
                    displayMode={true}
                    edit={isEditing}
                    {...formAttrs.title}
                    getText={setTitleField}
                  />
                ) : (
                  <div className="title">{form.values.title}</div>
                )}
                {isOwner ? (
                  <InputTextField
                    autoUpdate={true}
                    textAreaAutoSize={true}
                    value={form.values.description}
                    textarea={true}
                    displayMode={true}
                    edit={isEditing}
                    {...formAttrs.description}
                    getText={setDescriptionField}
                  />
                ) : (
                  <div className="description">{form.values.description}</div>
                )}
                <div className="actions">
                  {following ? (
                    <div className="follow-and-followers">
                      <SecondaryButton onClick={toggleFollow}>
                        <Trans>Unfollow</Trans>
                      </SecondaryButton>
                    </div>
                  ) : (
                    <div className="follow-and-followers">
                      <PrimaryButton disabled={!isAuthenticated} onClick={toggleFollow}>
                        <Trans>Follow</Trans>
                      </PrimaryButton>
                    </div>
                  )}
                  <div className={`followers`}>
                    <PermIdentityIcon />
                    <span>{numFollowers}</span>
                  </div>
                </div>
              </div>
            </Card>
            <div className="main-content">
              <div className="main-column">
                <ListCard
                  content={resourceCardPropsList.map(resourceCardProps => {
                    return <ResourceCard {...resourceCardProps} isEditing={isEditing} />
                  })}
                  className="resources no-card"
                />
                <div className="collection-footer">
                  <div className="left-column">{!isOwner && <ContributorCard {...contributorCardProps} />}</div>
                  <div className="right-column">
                    {actionsCard}
                    {extraDetails}
                  </div>
                  <div className="one-column">
                    {actionsCard}
                    {!isOwner && <ContributorCard {...contributorCardProps} />}
                    {extraDetails}
                  </div>
                </div>
              </div>
              <div className="side-column">
                {!isOwner && <ContributorCard {...contributorCardProps} />}
                {actionsCard}
                {extraDetails}
              </div>
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)
