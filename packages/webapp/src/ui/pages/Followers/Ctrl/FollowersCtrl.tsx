import { isEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { useEffect, useMemo } from 'react'
import { useSession } from '../../../../context/Global/Session'
import { useSmallProfileCardCtrl } from '../../../components/cards/SmallProfileCard/Ctrl/SmallProfileCardCtrl'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { FollowersProps } from '../Followers'
import { useFollowersPageLazyQuery } from './Followers.gen'

export const useFollowersCtrl: CtrlHook<FollowersProps, {}> = () => {
  // const [sortBy, setSortBy] = useState<GlobalFollowersSort>('Popularity')
  const { session } = useSession()
  const [queryFollowers, FollowersQ] = useFollowersPageLazyQuery()
  useEffect(() => {
    if (!session?.profile.id) {
      return
    }
    queryFollowers({
      variables: {
        profileId: session.profile.id,
      },
    })
  }, [queryFollowers, session?.profile.id])

  const profileNode = narrowNodeType(['Profile'])(FollowersQ.data?.node)

  const profiles = useMemo(
    () => (profileNode?.profiles.edges || []).filter(isEdgeNodeOfType(['Profile'])).map(({ node }) => node),
    [profileNode?.profiles.edges],
  )

  const FollowersUIProps = useMemo(() => {
    const props: FollowersProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template'),

      browserProps: {
        smallProfileCardPropsList: profiles.map(profile =>
          ctrlHook(useSmallProfileCardCtrl, { id: profile.id }, `Followers Profile ${profile.id}`),
        ),
        resourceCardPropsList: null,
        setSortBy: null,
      },
    }
    return props
  }, [profiles])
  return [FollowersUIProps]
}
