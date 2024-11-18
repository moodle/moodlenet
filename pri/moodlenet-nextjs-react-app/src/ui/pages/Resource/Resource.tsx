'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { _nullish, d_u, selection, unreachable_never } from '@moodle/lib-types'
import { adoptAssetService } from '@moodle/module/content'
import { eduBloomCognitiveRecord, eduResourceData, eduResourceMetaFormSchema } from '@moodle/module/edu'
import { InsertDriveFile } from '@mui/icons-material'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { useAllPrimarySchemas, useAssetUrl } from '../../../lib/client/globalContexts'
import { default_noop_action, simpleHookSafeAction } from '../../../lib/common/actions'
import { appRoute } from '../../../lib/common/appRoutes'
import { Card } from '../../atoms/Card/Card'
import { PrimaryButton } from '../../atoms/PrimaryButton/PrimaryButton'
import { SecondaryButton } from '../../atoms/SecondaryButton/SecondaryButton'
import DateField from '../../molecules/ed-meta/fields/DateField/DateField'
import DropdownField from '../../molecules/ed-meta/fields/DropdownField'
import MainResourceCard from './MainResourceCard/MainResourceCard'
import './Resource.scss'
import { ResourceContributorCard, ResourceContributorCardProps } from './ResourceContributorCard/ResourceContributorCard'

type saveEduResourceMetaFn = simpleHookSafeAction<eduResourceMetaFormSchema, void>
export type eduResourceActions = {
  publish(): Promise<unknown>
  saveNewResourceAsset: adoptAssetService<'external' | 'upload'>
  editDraft: {
    saveMeta: saveEduResourceMetaFn
    applyImage: adoptAssetService
  }
  deleteDraft(): Promise<unknown>
  deletePublished(): Promise<unknown>
  unpublish(): Promise<unknown>
  like(): Promise<unknown>
}

export type resourcePageProps = d_u<
  {
    createDraft: {
      eduResourceData: _nullish
      actions: selection<eduResourceActions, 'saveNewResourceAsset'>
      contributorCardProps: _nullish
      eduBloomCognitiveRecords: _nullish
      references: _nullish
      allowedYears: _nullish
    }
    editDraft: {
      eduResourceData: eduResourceData
      actions: selection<eduResourceActions, 'editDraft', 'publish'>
      eduBloomCognitiveRecords: eduBloomCognitiveRecord[]
      references: _nullish
      contributorCardProps: _nullish
      allowedYears: number[]
    }
    viewPublished: {
      eduResourceData: eduResourceData
      references: {
        iscedField: {
          homePageRoute: appRoute
          name: string
        }
      }
      actions: selection<eduResourceActions, never, 'unpublish' | 'deletePublished'>
      contributorCardProps: ResourceContributorCardProps
      eduBloomCognitiveRecords: _nullish
      allowedYears: _nullish
    }
  },
  'activity'
>
export function ResourcePage(resourcePageProps: resourcePageProps) {
  const { actions, activity, contributorCardProps, eduResourceData, allowedYears } = resourcePageProps
  const schemas = useAllPrimarySchemas()
  const hookFormHandle = useHookFormAction(
    default_noop_action(actions.editDraft?.saveMeta),
    zodResolver(schemas.edu.eduResourceMetaSchema),
    {
      formProps: { defaultValues: eduResourceData ?? {} },
      actionProps: {
        onSuccess({ input }) {
          reset(input)
        },
      },
    },
  )
  const {
    form: { formState, register, reset, getValues, setValue },
  } = hookFormHandle

  const shouldShowErrors = formState.isDirty // && formState.isSubmitted

  const disableFields = activity === 'viewPublished'
  const [assetUrl] = useAssetUrl(eduResourceData?.asset)
  return (
    <div className="resource-page">
      <div className="main-card">
        <MainResourceCard {...{ ...resourcePageProps, hookFormHandle }} />
      </div>
      {activity === 'viewPublished' && (
        <div className="contributor-card">
          <ResourceContributorCard {...contributorCardProps} key="contributor-card" />
        </div>
      )}
      <div className="actions">
        <Card hideBorderWhenSmall={true}>
          {actions.unpublish && <SecondaryButton onClick={actions.unpublish}>Unpublish</SecondaryButton>}
          {activity === 'editDraft' && (
            <PrimaryButton onClick={() => alert('publishCheck')} color="green">
              Publish check
            </PrimaryButton>
          )}
          {actions.publish && (
            <PrimaryButton onClick={actions.publish} color="green">
              Publish
            </PrimaryButton>
          )}
          {/* activity === 'editDraft' && (
            <PrimaryButton onClick={startAutofill} color="green">
              Autofill missing fields
            </PrimaryButton>
          ) */}
          {activity === 'viewPublished' ? (
            eduResourceData.asset.type === 'external' ? (
              <a href={assetUrl} target="_blank" rel="noreferrer">
                <SecondaryButton key="download-or-open-link-button" disabled={disableFields}>
                  Open link
                </SecondaryButton>
              </a>
            ) : eduResourceData.asset.type === 'local' ? (
              <a href={assetUrl} target="_blank" rel="noreferrer" download={eduResourceData.asset.name}>
                <SecondaryButton key="download-or-open-link-button" disabled={disableFields}>
                  <InsertDriveFile />
                  Download file
                </SecondaryButton>
              </a>
            ) : (
              unreachable_never(eduResourceData.asset)
            )
          ) : null}
        </Card>
      </div>
      <div className="details">
        <DropdownField
          key="subject-field"
          disabled={disableFields}
          label="Subject"
          placeholder="Content category"
          edit={activity === 'editDraft'}
          options={[] /* subjectOptions */}
          error={formState.errors.iscedField?.message}
          {...register('iscedField')}
          shouldShowErrors={shouldShowErrors}
        />

        <DropdownField
          key="license-field"
          disabled={disableFields}
          label="License"
          placeholder="License type"
          edit={activity === 'editDraft'}
          options={[] /* licenseOptions */}
          error={formState.errors.license?.message}
          {...register('license')}
          shouldShowErrors={shouldShowErrors}
        />

        <DropdownField
          key="type-field"
          disabled={disableFields}
          label="Type"
          placeholder="Content type"
          edit={activity === 'editDraft'}
          options={[] /* typeOptions */}
          error={formState.errors.type?.message}
          {...register('type')}
          shouldShowErrors={shouldShowErrors}
        />

        <DropdownField
          key="level-field"
          disabled={disableFields}
          label="Level"
          placeholder="Education level"
          edit={activity === 'editDraft'}
          options={[] /* levelOptions */}
          error={formState.errors.iscedLevel?.message}
          {...register('iscedLevel')}
          shouldShowErrors={shouldShowErrors}
        />

        <DateField
          key="date-field"
          disabled={disableFields}
          canEdit={activity === 'editDraft'}
          month={getValues().publicationDate?.month}
          year={getValues().publicationDate?.year}
          allowedYears={allowedYears ?? []}
          editMonth={e => {
            setValue('publicationDate.month', e, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
          }}
          editYear={e => {
            setValue('publicationDate.year', e, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
          }}
          errorMonth={formState.errors.publicationDate?.month?.message}
          errorYear={formState.errors.publicationDate?.year?.message}
          shouldShowErrors={shouldShowErrors}
        />

        <DropdownField
          key="language-field"
          disabled={disableFields}
          label="Language"
          placeholder="Content language"
          edit={activity === 'editDraft'}
          options={[] /* languageOptions */}
          error={formState.errors.language?.message}
          {...register('language')}
          shouldShowErrors={shouldShowErrors}
        />
      </div>
    </div>
  )
}
/*

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (showUploadingSnackbar) {
      timeoutId = setTimeout(() => {
        addSnackbar({
          position: 'bottom',
          autoHideDuration: 6000,
          children: "Uploading file, feel free to move around the platform, just don't close this tab",
        })
      }, 4000)
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [showUploadingSnackbar, addSnackbar])

  useEffect(() => {
    if (autofillState === 'ai-generation') {
      addSnackbar({
        autoHideDuration: 6000,
        children: `Using AI to autofill the resource details, it usually takes a couple of minutes`,
      })
    } else if (autofillState === 'ai-completed') {
      addSnackbar({
        autoHideDuration: 6000,
        type: 'success',
        children: `Resource ready! Verify and edit any required details`,
      })
    } else if (autofillState === 'ai-error') {
      addSnackbar({
        autoHideDuration: 6000,
        children: `Unfortunatelly we couldn't complete AI autofill`,
      })
    }
  }, [addSnackbar, autofillState])

  useEffect(() => {
    if (showCheckPublishSuccess !== 'idle') {
      addSnackbar({
        autoHideDuration: 4000,
        type: showCheckPublishSuccess === 'success' ? 'success' : 'error',
        children:
          showCheckPublishSuccess === 'success' ? `Success, save before publishing` : `Failed, fix the errors and try again`,
        onClose: () => setShowCheckPublishSuccess('idle'),
      })
    }
  }, [addSnackbar, showCheckPublishSuccess])

  useEffect(() => {
    if (showPublishSuccess !== 'idle') {
      addSnackbar({
        type: showPublishSuccess === 'success' ? 'success' : 'error',
        autoHideDuration: 4000,
        children: showPublishSuccess === 'success' ? `Resource published` : `Failed, fix the errors and try again`,
        onClose: () => setShowPublishSuccess('idle'),
      })
    }
  }, [addSnackbar, showPublishSuccess])

  useEffect(() => {
    if (showUnpublishSuccess) {
      addSnackbar({
        type: 'success',
        autoHideDuration: 4000,
        children: 'Resource unpublished',
        onClose: () => setShowUnpublishSuccess(false),
      })
    }
  }, [addSnackbar, showUnpublishSuccess])

  const modals = (
    <>
      {isToDelete && deleteResource && (
        <Modal
          title={`Alert`}
          actions={
            <PrimaryButton
              onClick={() => {
                deleteResource()
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
          The resource will be deleted
        </Modal>
      )}
    </>
  )

  */
