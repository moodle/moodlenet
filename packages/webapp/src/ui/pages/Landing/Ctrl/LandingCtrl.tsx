import { isJust } from '@moodlenet/common/lib/utils/array'
import { useMemo } from 'react'
import { useGlobalSearchQuery } from '../../../../context/Global/GlobalSearch/globalSearch.gen'
import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { FollowTag } from '../../../types'
import { LandingProps } from '../Landing'

export const useLandingCtrl: CtrlHook<LandingProps, {}> = () => {
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
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}),
      organization: {
        name: localOrg.name,
        intro: localOrg.summary,
      },
      image: localOrg.icon ?? null,
      trendCardProps: { tags: tags || [] },
    }),
    [localOrg.icon, localOrg.name, localOrg.summary, tags],
  )
  // console.log({ landingProps })
  return [landingProps]
}
