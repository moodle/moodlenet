import { getAuthenticatedUserSessionOrRedirectToLogin } from '../../../lib/server/session-access'
import { CollectionPage, collectionPageProps } from '../../../ui/pages/Collection/Collection'
import { saveNewEduCollectionDraft } from './eduCollection-actions.server'
// import CollectionClient from './collection.client'

export default async function CreateDraftCollectionPage() {
  await getAuthenticatedUserSessionOrRedirectToLogin()
  const collectionPageProps: collectionPageProps = {
    activity: 'createDraft',
    actions: {
      saveNewDraft: saveNewEduCollectionDraft,
    },
    eduCollectionData: null,
    contributorCardProps: null,
  }
  return <CollectionPage {...collectionPageProps} />
}
