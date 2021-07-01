import { isJust } from '@moodlenet/common/lib/utils/array'
import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { FC, useMemo } from 'react'
import { useSession } from '../../context/Global/Session'
import { useMutateEdge } from '../../hooks/content/mutateEdge'
import { usePageHeaderProps } from '../../hooks/props/PageHeader'
import { CollectionCardProps } from '../../ui/components/cards/Collection'
import { ResourceCardProps } from '../../ui/components/cards/Resource'
import { SubjectFieldPage, SubjectFieldPageProps } from '../../ui/pages/SubjectField'
import { getMaybeAssetRefUrl } from '../lib'
import {
  useSubjectPageCollectionsQuery,
  // useSubjectPageFollowMutation,
  useSubjectPageNodeQuery,
  useSubjectPageResourcesQuery,
} from './SubjectFieldPage/SubjectFieldPage.gen'

export const SubjectPageComponent: FC<{ id: Id }> = ({ id }) => {
  const { currentProfile } = useSession()

  const nodeRes = useSubjectPageNodeQuery({ variables: { id } })
  const subject = nodeRes.data?.node
  if (subject && subject.__typename !== 'SubjectField') {
    throw new Error('never')
  }

  const collectionsRes = useSubjectPageCollectionsQuery({ variables: { id } })
  const collectionEdges = collectionsRes.data?.node?.collectionList.edges
  const collectionList = useMemo<SubjectFieldPageProps['collectionList']>(
    () =>
      (collectionEdges ?? [])
        .map(edge => {
          if (edge.node.__typename !== 'Collection') {
            return null
          }
          const { id, name, icon, followersCount, resourcesCount } = edge.node
          const props: CollectionCardProps = {
            name,
            icon: getMaybeAssetRefUrl(icon),
            homeLink: contentNodeLink({ id }),
            followers: followersCount,
            resources: resourcesCount,
          }

          return props
        })
        .filter(isJust),
    [collectionEdges],
  )

  const resourcesRes = useSubjectPageResourcesQuery({ variables: { id } })
  const resourceEdges = resourcesRes.data?.node?.resourceList.edges
  const resourceList = useMemo<SubjectFieldPageProps['resourceList']>(
    () =>
      (resourceEdges ?? [])
        .map(edge => {
          if (edge.node.__typename !== 'Resource') {
            return null
          }
          const { collections, name, icon, id } = edge.node
          const props: ResourceCardProps = {
            name,
            icon: getMaybeAssetRefUrl(icon),
            homeLink: contentNodeLink({ id }),
            type: 'pdf',
            collections: collections.edges
              .map(edge => {
                if (edge.node.__typename !== 'Collection') {
                  return null
                }
                const { id, name } = edge.node
                return {
                  homeLink: contentNodeLink({ id }),
                  name,
                }
              })
              .filter(isJust),
          }

          return props
        })
        .filter(isJust),
    [resourceEdges],
  )

  const followMut = useMutateEdge()
  const myFollowId = subject?.myFollow.edges[0]?.edge.id
  const me = useMemo(() => {
    return currentProfile
      ? {
          toggleFollow() {
            if (!currentProfile || followMut.createResult.loading || followMut.deleteResult.loading) {
              return
            }
            const toggleFollowPromise = myFollowId
              ? followMut.deleteEdge({ edgeId: myFollowId })
              : followMut.createEdge<'Follows'>({ data: {}, edgeType: 'Follows', from: currentProfile.id, to: id })
            toggleFollowPromise.then(() => nodeRes.refetch())
          },
          following: !!myFollowId,
        }
      : null
  }, [followMut, id, myFollowId, nodeRes, currentProfile])
  const pageHeaderProps = usePageHeaderProps()
  const props = useMemo<SubjectFieldPageProps | null>(() => {
    return subject
      ? {
          collections: subject.appliesToCollectionsCount,
          followers: subject.followersCount,
          resources: subject.appliesToResourcesCount,
          me,
          name: subject.name,
          summary: subject.summary,
          collectionList,
          resourceList,
          pageHeaderProps,
        }
      : null
  }, [subject, me, collectionList, resourceList, pageHeaderProps])
  return props && <SubjectFieldPage {...props} />
}
