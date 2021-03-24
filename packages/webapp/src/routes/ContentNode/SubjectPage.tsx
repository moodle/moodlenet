import { EdgeType, Id, NodeType } from '@moodlenet/common/lib/utils/content-graph'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { FC, useMemo } from 'react'
import { isJust } from '../../helpers/data'
import { getRelCount } from '../../helpers/nodeMeta'
import { usePageHeaderProps } from '../../hooks/props/PageHeader'
import { CollectionCardProps } from '../../ui/components/cards/Collection'
import { ResourceCardProps } from '../../ui/components/cards/Resource'
import { SubjectPage, SubjectPageProps } from '../../ui/pages/Subject'
import {
  useSubjectPageCollectionsQuery,
  // useSubjectPageFollowMutation,
  useSubjectPageNodeQuery,
  useSubjectPageResourcesQuery,
} from './SubjectPage/SubjectPage.gen'

export const SubjectPageComponent: FC<{ id: Id }> = ({ id }) => {
  // const { session } = useSession()

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
          const { _id, _meta, name, icon } = edge.node
          const props: CollectionCardProps = {
            name,
            icon: icon ?? '',
            homeLink: contentNodeLink({ _id }),
            followers: getRelCount(_meta, EdgeType.Follows, 'from', NodeType.Profile),
            resources: getRelCount(_meta, EdgeType.Contains, 'to', NodeType.Resource),
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
          const { collections, name, icon, _id } = edge.node
          const props: ResourceCardProps = {
            name,
            icon: icon ?? '',
            homeLink: contentNodeLink({ _id }),
            type: 'pdf',
            collections: collections.edges
              .map(edge => {
                if (edge.node.__typename !== 'Collection') {
                  return null
                }
                const { _id, name } = edge.node
                return {
                  homeLink: contentNodeLink({ _id }),
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

  // const [follow /* , followResp */] = useSubjectPageFollowMutation()
  // const [unfollow /* , unfollowResp */] = useSubjectPageUnfollowMutation()
  const pageHeaderProps = usePageHeaderProps()
  const props = useMemo<SubjectPageProps | null>(() => {
    // const myFollowId = subject?.myFollow.edges[0]?.edge._id

    return subject
      ? {
          collections: getRelCount(subject._meta, EdgeType.AppliesTo, 'to', NodeType.Collection),
          followers: getRelCount(subject._meta, EdgeType.Follows, 'from', NodeType.Profile),
          resources: getRelCount(subject._meta, EdgeType.Follows, 'from', NodeType.Profile),
          me: /* session?.profile
            ? {
                toggleFollow() {
                  if (!session?.profile) {
                    return
                  }
                  myFollowId
                    ? unfollow({ variables: { edgeId: myFollowId } })
                    : follow({ variables: { subjectId: id, currentProfileId: session.profile._id } })
                },
                following: !!myFollowId,
              }
            : */ null,
          name: subject.name,
          collectionList,
          resourceList,
          pageHeaderProps,
        }
      : null
  }, [subject, collectionList, resourceList, pageHeaderProps])
  return props && <SubjectPage {...props} />
}
