'use client'

import { _nullish, d_u, selection } from '@moodle/lib-types'
import { eduCollectionMeta, eduCollectionMetaFormSchema } from '@moodle/module/edu'
import { HookSafeActionFn } from 'next-safe-action/hooks'
import { Card } from '../../atoms/Card/Card'
import { PrimaryButton } from '../../atoms/PrimaryButton/PrimaryButton'
import { SecondaryButton } from '../../atoms/SecondaryButton/SecondaryButton'
import './Collection.scss'
import { CollectionContributorCard } from './CollectionContributorCard/CollectionContributorCard'
import { MainCollectionCard } from './MainCollectionCard/MainCollectionCard'

type saveEduCollectionMetaFn = HookSafeActionFn<unknown, eduCollectionMetaFormSchema, any, any, any, any>
export type eduCollectionActions = {
  publish(): Promise<unknown>
  saveNewDraft: saveEduCollectionMetaFn
  editDraft: saveEduCollectionMetaFn
  deleteDraft(): Promise<unknown>
  deletePublished(): Promise<unknown>
  applyImage(_: { tempId: string }): Promise<unknown>
  unpublish(): Promise<unknown>
  follow(): Promise<unknown>
  bookmark(): Promise<unknown>
}

export type collectionPageProps = d_u<
  {
    createDraft: {
      eduCollectionMeta: _nullish | eduCollectionMeta
      actions: selection<eduCollectionActions, 'saveNewDraft'>
    }
    editDraft: {
      eduCollectionMeta: eduCollectionMeta
      actions: selection<eduCollectionActions, 'editDraft', 'publish'>
    }
    viewPublished: {
      eduCollectionMeta: eduCollectionMeta
      actions: selection<eduCollectionActions, keyof eduCollectionActions>
    }
    // validationSchemas: imagesize, draft, publish
  },
  'activity'
>

export function CollectionPage(collectionPageProps: collectionPageProps) {
  const { activity, actions } = collectionPageProps

  // const resourceList = (
  //   <div className="resource-list">
  //     {resourceCardPropsList.map(({ key, props }) => (
  //       <ResourceCard
  //         {...props}
  //         orientation={'horizontal'}
  //         key={key}
  //         topRightItems={[
  //           canEdit && isEditing
  //             ? {
  //                 Item: () => (
  //                   <TertiaryButton onClick={() => removeResource(key)} className="delete">
  //                     <CloseRounded />
  //                   </TertiaryButton>
  //                 ),
  //                 key: 'remove-resource-button',
  //               }
  //             : null,
  //         ]}
  //       />
  //     ))}
  //   </div>
  // )

  // const checkPublishSnackbar = showCheckPublishSuccess ? (
  //   <Snackbar
  //     position="bottom"
  //     type="success"
  //     autoHideDuration={3000}
  //     showCloseButton={false}
  //     onClose={() => setShowCheckPublishSuccess(false)}
  //   >
  //     {`Success, save before publishing`}
  //   </Snackbar>
  // ) : null

  // const publishSnackbar = showPublishSuccess ? (
  //   <Snackbar
  //     position="bottom"
  //     type="success"
  //     autoHideDuration={3000}
  //     showCloseButton={false}
  //     onClose={() => setShowPublishSuccess(false)}
  //   >
  //     {`Collection published`}
  //   </Snackbar>
  // ) : null

  // const unpublishSnackbar = showUnpublishSuccess ? (
  //   <Snackbar
  //     position="bottom"
  //     type="success"
  //     autoHideDuration={3000}
  //     showCloseButton={false}
  //     onClose={() => setShowUnpublishSuccess(false)}
  //   >
  //     {`Collection unpublished`}
  //   </Snackbar>
  // ) : null

  // const snackbars = <SnackbarStack snackbarList={[checkPublishSnackbar, publishSnackbar, unpublishSnackbar]} />

  // const modals = (
  //   <>
  //     {isToDelete && (
  //       <Modal
  //         title={`Alert`}
  //         actions={
  //           <PrimaryButton
  //             onClick={() => {
  //               deleteCollection()
  //               setIsToDelete(false)
  //             }}
  //             color="red"
  //           >
  //             Delete
  //           </PrimaryButton>
  //         }
  //         onClose={() => setIsToDelete(false)}
  //         style={{ maxWidth: '400px' }}
  //         className="delete-message"
  //       >
  //         The collection will be deleted
  //       </Modal>
  //     )}
  //   </>
  // )
  return (
    <>
      {/* {modals}
        {snackbars} */}
      <div className="collection-page">
        <div className="main-card">
          <MainCollectionCard {...{ collectionPageProps }} />
        </div>
        <div className="contributor-card">
          <CollectionContributorCard
            {...{ avatarUrl: null, creatorProfileHref: '', displayName: 'ola' }}
            key="contributor-card"
          />
        </div>
        <div className="editor-actions">
          <Card className="editor-actions" hideBorderWhenSmall={true}>
            {actions.unpublish && <SecondaryButton onClick={() => actions.unpublish()}>Unpublish</SecondaryButton>}
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
          </Card>
        </div>
        <div className="resource-list">
          <Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
            <Card>Resource</Card>
          </Card>
        </div>
      </div>
    </>
  )
}
