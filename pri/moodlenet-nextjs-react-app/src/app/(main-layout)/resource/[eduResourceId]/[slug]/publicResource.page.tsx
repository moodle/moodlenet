// import ResourceClient from './resource.client'

import { params } from '../../../../../lib/server/types'

export default async function PublicResourcePage({
  params: { eduResourceId, slug },
}: {
  params: params<'eduResourceId' | 'slug'>
}) {
  return (
    <div>
      <pre>VIEW PUBLIC RESOURCE {JSON.stringify({ eduResourceId, slug }, null, 2)}</pre>
    </div>
  )
  // const [foundEduResource, resourcePageProps] = await access.primary.moodlenetReactApp.props.resourcePage({
  //   moodlenetEduResourceId,
  // })
  // if (!foundEduResource) {
  //   return <Fallback />
  // }
  // const { moodlenetEduResourceAccessObject } = resourcePageProps
  // if (moodlenetEduResourceAccessObject.slug !== slug) {
  //   redirect(routes.resource[moodlenetEduResourceId]![moodlenetEduResourceAccessObject.slug]!())
  // }

  // return <ResourceClient {...resourcePageProps} />
}
