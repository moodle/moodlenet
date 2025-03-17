import { getAuthenticatedUserSessionOrRedirectToLogin } from '../../../lib/server/session-client'
import { CollectionPage, collectionPageProps } from '../../../ui/pages/Collection/Collection'
import { getSaveNewEduCollectionDraft } from './eduCollection-actions.server'
// import CollectionClient from './collection.client'

export default async function CreateDraftCollectionPage() {
  await getAuthenticatedUserSessionOrRedirectToLogin()
  const collectionPageProps: collectionPageProps = {
    activity: 'createDraft',
    actions: {
      saveNewDraft: await getSaveNewEduCollectionDraft(),
    },
    eduCollectionData: null,
    contributorCardProps: null,
  }
  return <CollectionPage {...collectionPageProps} />
}
