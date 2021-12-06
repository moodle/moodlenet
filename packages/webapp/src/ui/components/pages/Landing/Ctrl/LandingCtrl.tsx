import { isEdgeNodeOfType } from '@moodlenet/common/dist/graphql/helpers'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useMemo } from 'react'
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
import { useLandingPageListsQuery } from './LandingCtrl.gen'
const signUpHref = href(mainPath.signUp)

export const useLandingCtrl: CtrlHook<LandingProps, {}> = () => {
  const { isAuthenticated } = useSession()
  const { setText: setSearchText } = useSearchUrlQuery()
  const LandingPageLists = useLandingPageListsQuery()
  const collectionCardPropsList = useMemo(
    () =>
      LandingPageLists.data?.node?.bookmarkedCollections.edges
        .filter(isEdgeNodeOfType(['Collection']))
        .map(({ node: { id } }) =>
          ctrlHook(
            useCollectionCardCtrl,
            {
              id,
            },
            id
          )
        ),
    [LandingPageLists.data?.node?.bookmarkedCollections.edges]
  )

  const resourceCardPropsList = useMemo(
    () =>
      LandingPageLists.data?.node?.bookmarkedResources.edges
        .filter(isEdgeNodeOfType(['Resource']))
        .map(({ node: { id } }) =>
          ctrlHook(
            useResourceCardCtrl,
            {
              id,
              removeAction: null,
            },
            id
          )
        ),
    [LandingPageLists.data?.node?.bookmarkedResources.edges]
  )

  const tags = useMemo(
    () =>
      LandingPageLists.data?.node?.trending.edges
        .filter(isEdgeNodeOfType(['IscedField', 'Collection']))
        .map<FollowTag>(({ node }) => ({
          name: node.name,
          type: node.__typename === 'Collection' ? 'collection' : 'subject',
          subjectHomeHref: href(nodeGqlId2UrlPath(node.id)),
        })),
    [LandingPageLists.data?.node?.trending.edges]
  )
  const { org: localOrg } = useLocalInstance()

  const landingProps = useMemo<LandingProps>(
    () => ({
      isAuthenticated,
      headerPageTemplateProps: ctrlHook(
        useHeaderPageTemplateCtrl,
        {},
        'header-page-template'
      ),
      organization: {
        name: localOrg.name,
        description: localOrg.description,
        subtitle: localOrg.subtitle,
      },
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
      localOrg.subtitle,
      tags,
      setSearchText,
      collectionCardPropsList,
      resourceCardPropsList,
    ]
  )
  // console.log({ landingProps })
  return [landingProps]
}
