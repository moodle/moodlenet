// import CollectionClient from './collection.client'

import { pageProps, paramRequired } from '../../../../../lib/server/page-props'

export default async function PublicCollectionPage({ params }: pageProps<{ eduCollectionId: string; slug: string }>) {
  const [eduCollectionId, slug] = await Promise.all([
    paramRequired('eduCollectionId', params),
    paramRequired('slug', params),
  ])
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
  //   redirect(routes.collection[moodlenetEduCollectionId]![moodlenetEduCollectionAccessObject.slug]!())
  // }

  // return <CollectionClient {...collectionPageProps} />
}
