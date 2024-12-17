// import ResourceClient from './resource.client'

import { pageProps, paramRequired } from '../../../../../lib/server/page-props'

export default async function PublicResourcePage({ params }: pageProps<{ eduResourceId: string; slug: string }>) {
  const [eduResourceId, slug] = await Promise.all([paramRequired('eduResourceId', params), paramRequired('slug', params)])

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
