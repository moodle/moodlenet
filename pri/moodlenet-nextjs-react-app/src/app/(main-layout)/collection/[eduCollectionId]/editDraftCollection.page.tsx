// import CollectionClient from './collection.client'

import { params } from '../../../../lib/server/types'

export default async function EditDraftCollectionPage({
  params: { eduCollectionId },
}: {
  params: params<'eduCollectionId'>
}) {
  return (
    <div>
      <pre>EDIT DRAFT COLLECTION {JSON.stringify({ eduCollectionId }, null, 2)}</pre>
    </div>
  )
  // const [foundEduCollection, collectionPageProps] = await access.primary.moodlenetReactApp.props.collectionPage({
  //   moodlenetEduCollectionId,
  // })
  // if (!foundEduCollection) {
  //   return <Fallback />
  // }
  // const { moodlenetEduCollectionAccessObject } = collectionPageProps
  // if (moodlenetEduCollectionAccessObject.slug !== slug) {
  //   redirect(sitepaths.collection[moodlenetEduCollectionId]![moodlenetEduCollectionAccessObject.slug]!())
  // }

  // return <CollectionClient {...collectionPageProps} />
}
