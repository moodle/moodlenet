import { isEdgeNodeOfType } from '@moodlenet/common/lib/graphql/helpers'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useMemo } from 'react'
import { useGlobalSearchQuery } from '../../../../../context/Global/GlobalSearch/globalSearch.gen'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { useSession } from '../../../../../context/Global/Session'
import { mainPath } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { FollowTag } from '../../../../types'
import { useCollectionCardCtrl } from '../../../molecules/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../molecules/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { useSearchUrlQuery } from '../../Search/Ctrl/useSearchUrlQuery'
import { LandingProps } from '../Landing'
const signUpHref = href(mainPath.signUp)

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
  const collectionsQ = useGlobalSearchQuery({
    variables: {
      nodeTypes: ['Collection'],
      text: '',
      page: { first: 5 },
    },
  })
  const collectionCardPropsList = useMemo(
    () =>
      collectionsQ.data?.globalSearch.edges.filter(isEdgeNodeOfType(['Collection'])).map(({ node: { id } }) =>
        ctrlHook(
          useCollectionCardCtrl,
          {
            id,
          },
          id,
        ),
      ),
    [collectionsQ.data?.globalSearch.edges],
  )
  const resourcesQ = useGlobalSearchQuery({
    variables: {
      nodeTypes: ['Resource'],
      text: '',
      page: { first: 6 },
    },
  })
  const resourceCardPropsList = useMemo(
    () =>
      resourcesQ.data?.globalSearch.edges.filter(isEdgeNodeOfType(['Resource'])).map(({ node: { id } }) =>
        ctrlHook(
          useResourceCardCtrl,
          {
            id,
            removeAction: null,
          },
          id,
        ),
      ),
    [resourcesQ.data?.globalSearch.edges],
  )

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
      collectionCardPropsList: collectionCardPropsList || [],
      resourceCardPropsList: resourceCardPropsList || [],
      signUpHref,
    }),
    [
      isAuthenticated,
      localOrg.name,
      localOrg.description,
      localOrg.intro,
      localOrg.icon,
      tags,
      setSearchText,
      collectionCardPropsList,
      resourceCardPropsList,
    ],
  )
  // console.log({ landingProps })
  return [landingProps]
}
