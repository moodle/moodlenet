import { isEdgeNodeOfType } from 'my-moodlenet-common/lib/graphql/helpers'
import { nodeGqlId2UrlPath } from 'my-moodlenet-common/lib/webapp/sitemap/helpers'
import { useMemo } from 'react'
import { useGlobalSearchQuery } from '../../../../context/Global/GlobalSearch/globalSearch.gen'
import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { useSession } from '../../../../context/Global/Session'
import { href } from '../../../elements/link'
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
      sort: { by: 'Popularity' },
      nodeTypes: ['Collection', 'IscedField'],
      text: '',
      page: { first: 5 },
    },
  })
  const tags = useMemo(
    () =>
      trendingQ.data?.globalSearch.edges
        .filter(isEdgeNodeOfType(['IscedField', 'Collection']))
        .map<FollowTag>(({ node }) => ({
          name: node.name,
          type: 'General',
          subjectHomeHref: href(nodeGqlId2UrlPath(node.id)),
        })),
    [trendingQ.data?.globalSearch.edges],
  )
  const { org: localOrg } = useLocalInstance()

  const landingProps = useMemo<LandingProps>(
    () => ({
      isAuthenticated,
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template'),
      organization: {
        name: localOrg.name,
        intro: localOrg.description,
        introTitle: localOrg.intro,
      },
      image: localOrg.icon ?? null,
      trendCardProps: { tags: tags || [] },
      setSearchText,
    }),
    [localOrg.icon, localOrg.description, isAuthenticated, localOrg.name, localOrg.intro, setSearchText, tags],
  )
  // console.log({ landingProps })
  return [landingProps]
}
