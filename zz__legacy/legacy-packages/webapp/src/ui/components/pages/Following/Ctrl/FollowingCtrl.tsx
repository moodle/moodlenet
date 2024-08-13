import { t } from '@lingui/macro'
import {
  isEdgeNodeOfType,
  narrowNodeType,
} from '@moodlenet/common/dist/graphql/helpers'
import { useEffect, useMemo } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useCollectionCardCtrl } from '../../../molecules/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useSmallProfileCardCtrl } from '../../../molecules/cards/SmallProfileCard/Ctrl/SmallProfileCardCtrl'
import { useIscedfCardCtrl } from '../../../molecules/cards/SubjectCard/Ctrl/IscedfCardCtrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { FollowingProps } from '../Following'
import { useFollowingPageLazyQuery } from './Following.gen'

export const useFollowingCtrl: CtrlHook<FollowingProps, {}> = () => {
  // const [sortBy, setSortBy] = useState<GlobalFollowingSort>('Popularity')
  const { session } = useSession()
  const [queryFollowing, followingQ] = useFollowingPageLazyQuery({
    fetchPolicy: 'cache-and-network',
  })
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

  const profileNode = narrowNodeType(['Profile', 'Organization'])(
    followingQ.data?.node
  )

  const collections = useMemo(
    () =>
      (profileNode?.collections.edges || [])
        .filter(isEdgeNodeOfType(['Collection']))
        .map(({ node }) => node),
    [profileNode?.collections.edges]
  )
  const subjects = useMemo(
    () =>
      (profileNode?.subjects.edges || [])
        .filter(isEdgeNodeOfType(['IscedField']))
        .map(({ node }) => node),
    [profileNode?.subjects.edges]
  )
  const profiles = useMemo(
    () =>
      (profileNode?.profiles.edges || [])
        .filter(isEdgeNodeOfType(['Profile']))
        .map(({ node }) => node),
    [profileNode?.profiles.edges]
  )

  const followingUIProps = useMemo(() => {
    const props: FollowingProps = {
      headerPageTemplateProps: ctrlHook(
        useHeaderPageTemplateCtrl,
        {},
        'header-page-template'
      ),

      browserProps: {
        collectionCardPropsList: collections.map((collection) =>
          ctrlHook(
            useCollectionCardCtrl,
            { id: collection.id },
            `Following Collection ${collection.id} Card`
          )
        ),
        smallProfileCardPropsList: profiles.map((profile) =>
          ctrlHook(
            useSmallProfileCardCtrl,
            { id: profile.id },
            `Following Profile ${profile.id}`
          )
        ),
        subjectCardPropsList: subjects.map((subject) =>
          ctrlHook(
            useIscedfCardCtrl,
            { id: subject.id },
            `Following Profile ${subject.id}`
          )
        ),
        resourceCardPropsList: null,
        setSortBy: null,
        setFilters: null,
        title: t`Following`,
      },
    }
    return props
  }, [collections, profiles, subjects])
  return [followingUIProps]
}
