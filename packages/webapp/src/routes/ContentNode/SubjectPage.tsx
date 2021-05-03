import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { FC, useMemo } from 'react'
import { useSession } from '../../contexts/Global/Session'
import { isJust } from '../../helpers/data'
import { useMutateEdge } from '../../hooks/content/mutateEdge'
import { usePageHeaderProps } from '../../hooks/props/PageHeader'
import { CollectionCardProps } from '../../ui/components/cards/Collection'
import { ResourceCardProps } from '../../ui/components/cards/Resource'
import { SubjectPage, SubjectPageProps } from '../../ui/pages/Subject'
import { getMaybeAssetRefUrl } from '../lib'
import {
  useSubjectPageCollectionsQuery,
  // useSubjectPageFollowMutation,
  useSubjectPageNodeQuery,
  useSubjectPageResourcesQuery,
} from './SubjectPage/SubjectPage.gen'

export const SubjectPageComponent: FC<{ id: Id }> = ({ id }) => {
  const { session } = useSession()

  const nodeRes = useSubjectPageNodeQuery({ variables: { id } })
  const subject = nodeRes.data?.node
  if (subject && subject.__typename !== 'Subject') {
    throw new Error('never')
  }

  const collectionsRes = useSubjectPageCollectionsQuery({ variables: { id } })
  const collectionEdges = collectionsRes.data?.node?.collectionList.edges
  const collectionList = useMemo<SubjectPageProps['collectionList']>(
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
  const resourceList = useMemo<SubjectPageProps['resourceList']>(
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
  const myProfile = session?.profile
  const me = useMemo(() => {
    return myProfile
      ? {
          toggleFollow() {
            if (!myProfile || followMut.createResult.loading || followMut.deleteResult.loading) {
              return
            }
            const toggleFollowPromise = myFollowId
              ? followMut.deleteEdge({ edgeId: myFollowId })
              : followMut.createEdge<'Follows'>({ data: {}, edgeType: 'Follows', from: myProfile.id, to: id })
            toggleFollowPromise.then(() => nodeRes.refetch())
          },
          following: !!myFollowId,
        }
      : null
  }, [followMut, id, myFollowId, nodeRes, myProfile])
  const pageHeaderProps = usePageHeaderProps()
  const props = useMemo<SubjectPageProps | null>(() => {
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
  return props && <SubjectPage {...props} />
}
