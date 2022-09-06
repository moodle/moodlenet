import { isEdgeNodeOfType } from '@moodlenet/common/dist/graphql/helpers'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useMemo } from 'react'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { useSession } from '../../../../../context/Global/Session'
import { getJustAssetRefUrl } from '../../../../../helpers/data'
import { mainPath } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { FollowTag } from '../../../../types'
import { useCollectionCardCtrl } from '../../../molecules/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../molecules/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { useSmallProfileCardCtrl } from '../../../molecules/cards/SmallProfileCard/Ctrl/SmallProfileCardCtrl'
import { FilterType, filterTypes } from '../../../organisms/Browser/Browser'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { useBrowserUrlQuery } from '../../Search/Ctrl/useSearchUrlQuery'
import { LandingProps } from '../Landing'
import { useLandingPageListsQuery } from './LandingCtrl.gen'
const newCollectionHref = href(mainPath.createNewCollection)
const newResourceHref = href(mainPath.createNewResource)
const loginHref = href(mainPath.login)
const signUpHref = href(mainPath.signUp)
const searchHref = (filterType: FilterType) =>
  href(
    `${mainPath.search}?${filterTypes
      .filter((fltTyp) => fltTyp !== filterType)
      .map((fltTyp) => `hideTypes=${fltTyp}`)
      .join('&')}`
  )

export const useLandingCtrl: CtrlHook<LandingProps, {}> = () => {
  const { isAuthenticated } = useSession()
  const { setText: setSearchText } = useBrowserUrlQuery()
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
  const smallProfileCardPropsList = useMemo(
    () =>
      LandingPageLists.data?.node?.followedProfiles.edges
        .filter(isEdgeNodeOfType(['Profile']))
        .map(({ node: { id } }) =>
          ctrlHook(
            useSmallProfileCardCtrl,
            {
              id,
            },
            id
          )
        ),
    [LandingPageLists.data?.node?.followedProfiles.edges]
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
        title: localOrg.subtitle,
        subtitle: localOrg.description,
        smallLogo: getJustAssetRefUrl(localOrg.smallLogo),
      },
      trendCardProps: { tags: tags || [] },
      setSearchText,
      smallProfileCardPropsList: smallProfileCardPropsList || [],
      collectionCardPropsList: collectionCardPropsList || [],
      resourceCardPropsList: resourceCardPropsList || [],
      // smallProfileCardPropsList: SmallProfileCardPropsList ||  []
      newCollectionHref,
      newResourceHref,
      loginHref,
      signUpHref,
      searchResourcesHref: searchHref('Resources'),
      searchCollectionsHref: searchHref('Collections'),
      searchAuthorsHref: searchHref('People'),
    }),
    [
      isAuthenticated,
      localOrg.name,
      localOrg.smallLogo,
      localOrg.subtitle,
      localOrg.description,
      tags,
      setSearchText,
      smallProfileCardPropsList,
      collectionCardPropsList,
      resourceCardPropsList,
    ]
  )
  // console.log({ landingProps })
  return [landingProps]
}
