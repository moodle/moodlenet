
import { Trans } from '@lingui/macro'
import EditIcon from '@material-ui/icons/Edit'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import SaveIcon from '@material-ui/icons/Save'
import ShareIcon from '@material-ui/icons/Share'
import { useState } from 'react'
import Card from '../../components/atoms/Card/Card'
import Dropdown from '../../components/atoms/Dropdown/Dropdown'
import InputTextField from '../../components/atoms/InputTextField/InputTextField'
import PrimaryButton from '../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton'
import { CP, withCtrl } from '../../lib/ctrl'
import { FormikBag } from '../../lib/formik'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { getResourceColorType, ResourceType } from '../../types'
import { DropdownField } from '../NewResource/FieldsData'
import { NewResourceFormValues } from '../NewResource/types'
import { ContributorCard, ContributorCardProps } from './ContributorCard/ContributorCard'
import { ResourceActionsCard, ResourceActionsCardProps } from './ResourceActionsCard/ResourceActionsCard'
import './styles.scss'

export type ResourceProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  isOwner: boolean
  title: string
  liked: boolean
  type: ResourceType
  tags: Array<string>
  contributorCardProps: ContributorCardProps
  resourceActionsCard: ResourceActionsCardProps
  formBag: FormikBag<NewResourceFormValues>
  types: DropdownField
  levels: DropdownField
  months: DropdownField
  years: DropdownField
  languages: DropdownField
  formats: DropdownField
}

export const Resource = withCtrl<ResourceProps>(
  ({
    headerPageTemplateProps,
    isOwner,
    liked,
    type,
    tags,
    contributorCardProps,
    resourceActionsCard,
    formBag, 
    types, 
    levels,
    months,
    years,
    languages,
    formats
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [likeState, setLikeState] = useState<boolean>(liked)

    const handleOnEditClick = () => {
      setIsEditing(true)
    }
    const handleOnSaveClick = () => {
      setIsEditing(false)
    }
    
    const tagSet = tags.map((value: string, index: number) => {
      return (
        <div key={index} className="tag">
          {value}
        </div>
      )
    })

    const [form, formAttrs] = formBag
    const extraDetails = (
      <Card className="extra-details-card">
        <Dropdown {...types} {...formAttrs.type} getValue={(value) => form.setFieldValue('type', value)}/>
        <Dropdown {...levels} {...formAttrs.level} getValue={(value) => form.setFieldValue('level', value)}/>
        <div className="date">
          <label><Trans>Original Creation Date</Trans></label>
          <div className="fields">
            <Dropdown {...months} {...formAttrs.originalDateMonth} getValue={() => form.setFieldValue('originalDateMonth', null)}/>
            <Dropdown {...years} {...formAttrs.originalDateYear} getValue={() => form.setFieldValue('originalDateYear', null)}/>
          </div>
        </div>
        <Dropdown {...languages} {...formAttrs.language} getValue={(value) => form.setFieldValue('language', value)}/>
        <Dropdown {...formats} {...formAttrs.format} getValue={(value) => form.setFieldValue('format', value)}/>
      </Card>
    )

    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="resource">
          <div className="content">
            <div className="main-column">
              <Card className="main-resource-card">
                <div className="resource-header">
                  <div className="type-and-actions">
                    <span className="type">
                      <Trans>Resource</Trans>
                      <div style={{ color: getResourceColorType(type) }}>&nbsp;/ {type}</div>
                    </span>
                    <div className="actions">
                    <div className={`like ${likeState && 'liked'}`} onClick={() => setLikeState(!likeState)}>
                      { likeState ? (
                        <FavoriteIcon/>
                      ) : (
                        <FavoriteBorderIcon/>
                      )}
                      <Trans>Like</Trans>
                    </div>
                    <div className="share"><ShareIcon/><Trans>Share</Trans></div>
                    <div className="edit-save">
                      { isOwner && isEditing ? (
                        <PrimaryButton color="green" onHoverColor="orange" onClick={handleOnSaveClick}><SaveIcon/></PrimaryButton>
                      ) : (
                        <SecondaryButton onClick={handleOnEditClick} color="orange"><EditIcon/></SecondaryButton>
                      )}
                    </div>
                  </div>
                  </div>
                  { isOwner ? (
                    <InputTextField
                      className="title"
                      autoUpdate={true}
                      value={form.values.title}
                      displayMode={true}
                      edit={isEditing}
                      {...formAttrs.title}
                    />
                  ) : (
                    <div className="title">{form.values.title}</div>   
                  )}
                  <div className="tags scroll">{tagSet}</div>
                </div>
                <img className="image" src={typeof form.values.image === 'string' ? form.values.image : ''} alt="Background" />
                { isOwner ? (
                  <InputTextField
                    autoUpdate={true}
                    value={form.values.description}
                    textarea={true}
                    displayMode={true}
                    edit={isEditing}
                    {...formAttrs.description}
                  />
                ) : (
                  <div className="description">{form.values.description}</div> 
                )}
                {/*<div className="comments"></div>*/}
              </Card>
              <div className="resource-footer">
                <ContributorCard {...contributorCardProps} />
                <ResourceActionsCard {...resourceActionsCard} />
              </div>
            </div>
            <div className="side-column">
              <ContributorCard {...contributorCardProps} />
              <ResourceActionsCard {...resourceActionsCard} />
              {extraDetails}
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)
Resource.displayName = 'ResourcePage'
