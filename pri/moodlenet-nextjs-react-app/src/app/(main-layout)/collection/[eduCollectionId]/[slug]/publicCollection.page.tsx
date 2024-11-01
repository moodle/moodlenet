// import CollectionClient from './collection.client'

import { params } from '../../../../../lib/server/types'

export default async function PublicCollectionPage({
  params: { eduCollectionId, slug },
}: {
  params: params<'eduCollectionId' | 'slug'>
}) {
  return (
    <div>
      <pre>VIEW PUBLIC COLLECTION {JSON.stringify({ eduCollectionId, slug }, null, 2)}</pre>
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
