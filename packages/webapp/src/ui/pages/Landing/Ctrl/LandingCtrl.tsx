import { isJust } from '@moodlenet/common/lib/utils/array'
import { useMemo } from 'react'
import { useGlobalSearchQuery } from '../../../../context/Global/GlobalSearch/globalSearch.gen'
import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { useSession } from '../../../../context/Global/Session'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { FollowTag } from '../../../types'
import { useSearchUrlQuery } from '../../Search/Ctrl/useSearchUrlQuery'
import { LandingProps } from '../Landing'

export const useLandingCtrl: CtrlHook<LandingProps, {}> = () => {
  const { isAuthenticated } = useSession()
  const { setText: setSearchText } = useSearchUrlQuery()
  const trendingQ = useGlobalSearchQuery({
    variables: {
      sortBy: 'Popularity',
      nodeTypes: ['Collection', 'SubjectField'],
      text: '',
    },
  })
  const tags = useMemo(
    () =>
      trendingQ.data?.globalSearch.edges
        .map(edge =>
          edge.node.__typename === 'SubjectField' || edge.node.__typename === 'Collection' ? edge.node : null,
        )
        .filter(isJust)
        .map<FollowTag>(node => ({
          name: node.name,
          type: 'Specific',
        })),
    [trendingQ.data?.globalSearch.edges],
  )
  const { org: localOrg } = useLocalInstance()

  const landingProps = useMemo<LandingProps>(
    () => ({
      isAuthenticated,
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}),
      organization: {
        name: localOrg.name,
        intro: localOrg.summary,
      },
      image: localOrg.icon ?? null,
      trendCardProps: { tags: tags || [] },
      setSearchText,
    }),
    [localOrg.icon, isAuthenticated, localOrg.name, localOrg.summary, setSearchText, tags],
  )
  // console.log({ landingProps })
  return [landingProps]
}
