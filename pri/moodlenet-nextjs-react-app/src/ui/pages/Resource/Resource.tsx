import { unreachable_never } from '@moodle/lib-types'
import { Card } from '../../atoms/Card/Card'
import { PrimaryButton } from '../../atoms/PrimaryButton/PrimaryButton'
import { SecondaryButton } from '../../atoms/SecondaryButton/SecondaryButton'
import DateField from '../../molecules/ed-meta/fields/DateField/DateField'
import DropdownField from '../../molecules/ed-meta/fields/DropdownField'
import MainResourceCard from './MainResourceCard/MainResourceCard'
import { ResourceContributorCard } from './ResourceContributorCard/ResourceContributorCard'
import { InsertDriveFile } from '@mui/icons-material'
import './Resource.scss'

export type ResourcePageProps = {}

export function ResourcePage({}: ResourcePageProps) {
  const disableFields = activity === 'viewPublished'

  return (
    <div className="resource-page">
      <div className="main-card">
        <MainResourceCard {...{ resourcePageProps }} />
      </div>
      {activity === 'viewPublished' && (
        <div className="contributor-card">
          <ResourceContributorCard {...contributorCardProps} key="contributor-card" />
        </div>
      )}
      <div className="actions">
        <Card hideBorderWhenSmall={true}>
          {actions.unpublish && <SecondaryButton onClick={() => actions.unpublish?.()}>Unpublish</SecondaryButton>}
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
          {activity === 'editDraft' && (
            <PrimaryButton onClick={startAutofill} color="green">
              Autofill missing fields
            </PrimaryButton>
          )}
          {activity === 'viewPublished' ? (
            type === 'link' ? (
              <a href={contentUrl && !disableFields ? contentUrl : undefined} target="_blank" rel="noreferrer">
                <SecondaryButton key="download-or-open-link-button" disabled={disableFields}>
                  Open link
                </SecondaryButton>
              </a>
            ) : type === 'local' ? (
              <a
                href={contentUrl && !disableFields ? contentUrl : undefined}
                target="_blank"
                rel="noreferrer"
                download={downloadFilename}
              >
                <SecondaryButton key="download-or-open-link-button" disabled={disableFields}>
                  <InsertDriveFile />
                  Download file
                </SecondaryButton>
              </a>
            ) : (
              unreachable_never(type)
            )
          ) : null}
        </Card>
      </div>
      <div className="details">
        <DropdownField
          key="subject-field"
          disabled={disableFields}
          title="Subject"
          placeholder="Content category"
          canEdit={activity === 'editDraft'}
          selection={form.values.subject}
          options={subjectOptions}
          error={form.errors.subject}
          edit={e => form.setFieldValue('subject', e)}
          // shouldShowErrors={shouldShowErrors}
        />

        <DropdownField
          key="license-field"
          disabled={disableFields}
          title="License"
          placeholder="License type"
          canEdit={activity === 'editDraft'}
          selection={form.values.license}
          options={licenseOptions}
          edit={e => {
            form.setFieldValue('license', e)
          }}
          error={form.errors.license}
          // shouldShowErrors={shouldShowErrors}
        />

        <DropdownField
          key="type-field"
          disabled={disableFields}
          title="Type"
          placeholder="Content type"
          canEdit={activity === 'editDraft'}
          selection={form.values.type}
          options={typeOptions}
          edit={e => {
            form.setFieldValue('type', e)
          }}
          error={form.errors.type}
          // shouldShowErrors={shouldShowErrors}
        />

        <DropdownField
          key="level-field"
          disabled={disableFields}
          title="Level"
          placeholder="Education level"
          canEdit={activity === 'editDraft'}
          selection={form.values.level}
          options={levelOptions}
          edit={e => {
            form.setFieldValue('level', e)
          }}
          error={form.errors.level}
          // shouldShowErrors={shouldShowErrors}
        />

        <DateField
          key="date-field"
          disabled={disableFields}
          canEdit={activity === 'editDraft'}
          month={form.values.month}
          monthOptions={monthOptions}
          year={form.values.year}
          yearOptions={yearOptions}
          editMonth={e => {
            form.setFieldValue('month', e)
          }}
          editYear={e => {
            form.setFieldValue('year', e)
          }}
          errorMonth={form.errors.month}
          errorYear={form.errors.year}
          // shouldShowErrors={shouldShowErrors}
        />

        <DropdownField
          key="language-field"
          disabled={disableFields}
          title="Language"
          placeholder="Content language"
          canEdit={activity === 'editDraft'}
          selection={form.values.language}
          options={languageOptions}
          edit={e => {
            form.setFieldValue('language', e)
          }}
          error={form.errors.language}
          // shouldShowErrors={shouldShowErrors}
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
