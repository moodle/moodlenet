import { Trans } from '@lingui/macro'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import { useCallback, useState } from 'react'
import Card from '../../components/atoms/Card/Card'
import Dropdown from '../../components/atoms/Dropdown/Dropdown'
import InputTextField from '../../components/atoms/InputTextField/InputTextField'
import PrimaryButton from '../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton'
import ListCard from '../../components/cards/ListCard/ListCard'
import { OverallCard, OverallCardProps } from '../../components/cards/OverallCard/OverallCard'
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
  following: boolean
  contributorCardProps: ContributorCardProps
  overallCardProps: Omit<OverallCardProps, 'hideBorderWhenSmall'>
  formBag: FormikBag<NewCollectionFormValues>
  categories: DropdownField
  resourceCardPropsList: CP<ResourceCardProps>[]
  updateCollection: () => unknown
}

export const Collection = withCtrl<CollectionProps>(
  ({
    headerPageTemplateProps,
    isAuthenticated,
    isOwner,
    following,
    contributorCardProps,
    overallCardProps,
    formBag,
    categories,
    resourceCardPropsList,
    updateCollection,
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isFollowig, setIsFollowing] = useState<boolean>(following)

    const handleOnEditClick = () => {
      setIsEditing(true)
    }
    const handleOnSaveClick = () => {
      updateCollection()
      setIsEditing(false)
    }

    const handleOnFollowClick = () => {
      setIsFollowing(true)
    }
    const handleOnUnfollowClick = () => {
      setIsFollowing(false)
    }

    const handleOnRemoveResourceClick = () => {
      // TODO
    }

    const handleOnDeleteCollectionClick = () => {
      // TODO
    }

    const actionsCard = (
      <Card className="collection-actions-card" hideBorderWhenSmall={true}>
        <PrimaryButton disabled={!isAuthenticated}>
          <Trans>Send all to Moodle</Trans>
        </PrimaryButton>
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
          <SecondaryButton color="red" onHoverColor="filled-red" onClick={handleOnDeleteCollectionClick}>
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
              </div>
              {isOwner ? (
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
              ) : (
                <div className="actions">
                  {isFollowig ? (
                    <SecondaryButton onClick={handleOnUnfollowClick}>
                      <Trans>Unfollow</Trans>
                    </SecondaryButton>
                  ) : (
                    <PrimaryButton disabled={!isAuthenticated} onClick={handleOnFollowClick}>
                      <Trans>Follow</Trans>
                    </PrimaryButton>
                  )}
                </div>
              )}
            </Card>
            <div className="main-content">
              <div className="main-column">
                <ListCard
                  content={resourceCardPropsList.map(resourceCardProps => {
                    return (
                      <ResourceCard
                        {...resourceCardProps}
                        showRemoveButton={isEditing}
                        onRemoveClick={handleOnRemoveResourceClick}
                      />
                    )
                  })}
                  className="resources no-card"
                />
                <div className="collection-footer">
                  <div className="left-column">
                    {!isOwner && <ContributorCard {...contributorCardProps} />}
                    {!isOwner && <OverallCard {...overallCardProps} />}
                  </div>
                  <div className="right-column">
                    {actionsCard}
                    {extraDetails}
                  </div>
                  <div className="one-column">
                    {actionsCard}
                    {!isOwner && <ContributorCard {...contributorCardProps} />}
                    {!isOwner && <OverallCard {...overallCardProps} hideBorderWhenSmall={true} />}
                    {extraDetails}
                  </div>
                </div>
              </div>
              <div className="side-column">
                {!isOwner && <ContributorCard {...contributorCardProps} />}
                {!isOwner && <OverallCard {...overallCardProps} />}
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
