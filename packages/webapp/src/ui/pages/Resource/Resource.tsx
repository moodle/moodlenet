import { Trans } from '@lingui/macro'
import EditIcon from '@material-ui/icons/Edit'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import SaveIcon from '@material-ui/icons/Save'
import ShareIcon from '@material-ui/icons/Share'
import { useCallback, useState } from 'react'
import Card from '../../components/atoms/Card/Card'
import Dropdown from '../../components/atoms/Dropdown/Dropdown'
import InputTextField from '../../components/atoms/InputTextField/InputTextField'
import PrimaryButton from '../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton'
import { CP, withCtrl } from '../../lib/ctrl'
import { FormikBag } from '../../lib/formik'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { getResourceColorType } from '../../types'
import { DropdownField, FormatDropdown } from '../NewResource/FieldsData'
import { NewResourceFormValues } from '../NewResource/types'
import { ContributorCard, ContributorCardProps } from './ContributorCard/ContributorCard'
import { ResourceActionsCard, ResourceActionsCardProps } from './ResourceActionsCard/ResourceActionsCard'
import './styles.scss'

export type ResourceProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  isOwner: boolean
  title: string
  liked: boolean
  tags: Array<string>
  contributorCardProps: ContributorCardProps
  resourceActionsCard: ResourceActionsCardProps
  formBag: FormikBag<NewResourceFormValues>
  types: DropdownField
  levels: DropdownField
  months: DropdownField
  years: DropdownField
  languages: DropdownField
  // formats: DropdownField
  licenses: DropdownField
  categories: DropdownField
}

export const Resource = withCtrl<ResourceProps>(
  ({
    headerPageTemplateProps,
    isOwner,
    liked,
    tags,
    contributorCardProps,
    resourceActionsCard, //FIXME: What this ?
    formBag,
    types,
    levels,
    months,
    years,
    languages,
    // formats,
    licenses,
    categories,
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
    const setFieldValue = form.setFieldValue
    const setTypeField = useCallback((_: string) => setFieldValue('type', _), [setFieldValue])
    const setLevelField = useCallback((_: string) => setFieldValue('level', _), [setFieldValue])
    const setMonthField = useCallback((_: string) => setFieldValue('originalDateMonth', _), [setFieldValue])
    const setYearField = useCallback((_: string) => setFieldValue('originalDateYear', _), [setFieldValue])
    const setLangField = useCallback((_: string) => setFieldValue('language', _), [setFieldValue])
    const setCategoryField = useCallback((_: string) => setFieldValue('category', _), [setFieldValue])
    const setLicenseField = useCallback((_: string) => setFieldValue('license', _), [setFieldValue])
    const extraDetails = (
      <Card className="extra-details-card" hideBorderWhenSmall={true}>
        <Dropdown value={form.values.category} {...categories} {...formAttrs.category} displayMode={true} edit={isEditing} getValue={setCategoryField} />
        <Dropdown value={form.values.license} {...licenses} {...formAttrs.license} displayMode={true} edit={isEditing} getValue={setLicenseField}/>
        <Dropdown value={form.values.type} {...types} {...formAttrs.type} displayMode={true} edit={isEditing} getValue={setTypeField}/>
        <Dropdown value={form.values.level} {...levels} {...formAttrs.level} displayMode={true} edit={isEditing} getValue={setLevelField}/>
        <div className="date">
          <label><Trans>Original Creation Date</Trans></label>
          <div className="fields">
            <Dropdown value={form.values.originalDateMonth} {...months} {...formAttrs.originalDateMonth} displayMode={true} edit={isEditing} getValue={setMonthField}/>
            <Dropdown value={form.values.originalDateYear} {...years} {...formAttrs.originalDateYear} displayMode={true} edit={isEditing} getValue={setYearField}/>
          </div>
        </div>
        <Dropdown value={form.values.language} {...languages} {...formAttrs.language} displayMode={true} edit={isEditing} getValue={setLangField}/>
        <Dropdown value={form.values.format} {...FormatDropdown} {...formAttrs.format} displayMode={true} edit={false} />
      </Card>
    )

    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="resource">
          <div className="content">
            <div className="main-column">
              <Card className="main-resource-card" hideBorderWhenSmall={true}>
                <div className="resource-header">
                  <div className="type-and-actions">
                    <span className="type">
                      <Trans>Resource</Trans>
                      <div
                        style={{
                          color: getResourceColorType(form.values.type ? form.values.type : form.values.contentType),
                        }}
                      >
                        &nbsp;/ {form.values.type ? form.values.type : form.values.contentType}
                      </div>
                    </span>
                    <div className="actions">
                      <div className={`like ${likeState && 'liked'}`} onClick={() => setLikeState(!likeState)}>
                        {likeState ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        <Trans>Like</Trans>
                      </div>
                      <div className="share">
                        <ShareIcon />
                        <Trans>Share</Trans>
                      </div>
                      {isOwner && (
                        <div className="edit-save">
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
                  </div>
                  {isOwner ? (
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
                <img
                  className="image"
                  src={typeof form.values.image === 'string' ? form.values.image : ''}
                  alt="Background"
                />
                {isOwner ? (
                  <InputTextField
                    autoUpdate={true}
                    textAreaAutoSize={true}
                    value={form.values.description}
                    textarea={true}
                    displayMode={true}
                    edit={isEditing}
                    {...formAttrs.description}
                  />
                ) : (
                  <div className="description">{form.values.description}</div>
                )}
                {/* <div className="comments"></div> */}
              </Card>
              <div className="resource-footer">
                <div className="left-column">
                  <ContributorCard {...contributorCardProps} />
                  <ResourceActionsCard {...resourceActionsCard} />
                </div>
                <div className="right-column">{extraDetails}</div>
                <div className="one-column">
                  <ContributorCard {...contributorCardProps} />
                  <ResourceActionsCard {...resourceActionsCard} />
                  {extraDetails}
                </div>
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
