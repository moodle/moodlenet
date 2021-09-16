import { isEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { useEffect, useMemo } from 'react'
import { useSession } from '../../../../context/Global/Session'
import { useCollectionCardCtrl } from '../../../components/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { FollowingProps } from '../Following'
import { useFollowingPageLazyQuery } from './Following.gen'

export const useFollowingCtrl: CtrlHook<FollowingProps, {}> = () => {
  // const [sortBy, setSortBy] = useState<GlobalFollowingSort>('Popularity')
  const { session } = useSession()
  const [queryFollowing, followingQ] = useFollowingPageLazyQuery()
  useEffect(() => {
    if (!session?.profile.id) {
      return
    }
    queryFollowing({
      variables: {
        profileId: session.profile.id,
      },
    })
  }, [queryFollowing, session?.profile.id])

  const profileNode = narrowNodeType(['Profile'])(followingQ.data?.node)

  const collections = useMemo(
    () => (profileNode?.collections.edges || []).filter(isEdgeNodeOfType(['Collection'])).map(({ node }) => node),
    [profileNode?.collections.edges],
  )
  const resources = useMemo(
    () => (profileNode?.resources.edges || []).filter(isEdgeNodeOfType(['Resource'])).map(({ node }) => node),
    [profileNode?.resources.edges],
  )

  const followingUIProps = useMemo(() => {
    const props: FollowingProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template'),

      browserProps: {
        collectionCardPropsList: collections.map(collection =>
          ctrlHook(useCollectionCardCtrl, { id: collection.id }, `Following Collection ${collection.id} Card`),
        ),
        resourceCardPropsList: resources.map(resource =>
          ctrlHook(
            useResourceCardCtrl,
            { id: resource.id, removeAction: false },
            `Following Resource ${resource.id} Card`,
          ),
        ),
        subjectCardPropsList: null,
        setSortBy: null,
      },
    }
    return props
  }, [collections, resources])
  return [followingUIProps]
}
