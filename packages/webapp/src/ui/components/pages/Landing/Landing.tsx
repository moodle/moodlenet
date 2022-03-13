import { t, Trans } from '@lingui/macro'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Href } from '../../../elements/link'
import { CP, withCtrl } from '../../../lib/ctrl'
import defaultBackgroud from '../../../static/img/default-landing-background.png'
import { Organization } from '../../../types'
import Searchbox from '../../atoms/Searchbox/Searchbox'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import {
  CollectionCard,
  CollectionCardProps,
} from '../../molecules/cards/CollectionCard/CollectionCard'
import ListCard from '../../molecules/cards/ListCard/ListCard'
import ResourceCard, {
  ResourceCardProps,
} from '../../molecules/cards/ResourceCard/ResourceCard'
import TrendCard, {
  TrendCardProps,
} from '../../molecules/cards/TrendCard/TrendCard'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import './styles.scss'

export type LandingProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  collectionCardPropsList: CP<CollectionCardProps>[]
  resourceCardPropsList: CP<ResourceCardProps>[]
  trendCardProps: TrendCardProps
  organization: Pick<
    Organization,
    'name' | 'title' | 'subtitle' | 'description'
  >
  isAuthenticated: boolean
  signUpHref: Href
  setSearchText(text: string): unknown
  loadMoreResources?: (() => unknown) | null
}

export const Landing = withCtrl<LandingProps>(
  ({
    headerPageTemplateProps,
    trendCardProps,
    collectionCardPropsList,
    resourceCardPropsList,
    organization,
    loadMoreResources,
    setSearchText,
  }) => {
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
    const [widthCollectionCard, setWidthCollectionCard] = useState<number>(170)
    const [isSearchboxInViewport, setIsSearchboxInViewport] =
      useState<boolean>(true)
    const [numResources, setNumResources] = useState<number>(9)

    const background = {
      backgroundImage: 'url(' + /* imageUrl ||  */ defaultBackgroud + ')',
      backgroundSize: 'cover',
    }

    const calcNumResources = () => {
      if (window.innerWidth > 820 && window.innerWidth <= 1125) {
        const remainder = resourceCardPropsList.length % 2
        setNumResources(resourceCardPropsList.length - remainder)
      } else if (window.innerWidth > 1125) {
        const remainder = resourceCardPropsList.length % 3
        setNumResources(resourceCardPropsList.length - remainder)
      }
    }

    window.addEventListener('resize', calcNumResources)

    const getCollectionCardWidth = () => {
      const widthDoc = document.documentElement.clientWidth
      const margin =
        widthDoc < 675 ? 50 : widthDoc < 1250 ? 200 : widthDoc - 1100
      const containerWidth = widthDoc - margin
      var numElements = Math.trunc(containerWidth / (170 + 12))
      const overflow = 170 - (containerWidth - numElements * (170 + 12))
      if (overflow > -12 && overflow < 140) numElements++
      var partToGrow = 0
      var percentatgeToGrow = 0
      if (numElements === 1) {
        partToGrow = containerWidth - 50
        percentatgeToGrow = containerWidth / partToGrow
      } else {
        partToGrow = (numElements - 1) * (170 + 12) + 170 / 2
        percentatgeToGrow = containerWidth / partToGrow
      }
      return 170 * percentatgeToGrow
    }

    const setCollectionCardWidth = useCallback(() => {
      setWidthCollectionCard(getCollectionCardWidth())
    }, [setWidthCollectionCard])

    useLayoutEffect(() => {
      window.addEventListener('resize', setCollectionCardWidth)
      return () => {
        window.removeEventListener('resize', setCollectionCardWidth)
      }
    }, [setCollectionCardWidth])

    useEffect(() => {
      setCollectionCardWidth()
    })

    return (
      <HeaderPageTemplate
        {...headerPageTemplateProps}
        style={{ backgroundColor: 'white' }}
        hideSearchbox={isSearchboxInViewport}
      >
        <div className="landing">
          <div className="landing-header" style={background}>
            <div className="landing-title">
              <div className="title">{t`${organization.title}`}</div>
              <div className="subtitle">{t`${organization.subtitle}`}</div>
            </div>
            <Searchbox
              size="big"
              setSearchText={setSearchText}
              searchText=""
              placeholder={t`Search for open educational content`}
              setIsSearchboxInViewport={setIsSearchboxInViewport}
              marginTop={12}
            />
          </div>
          <div className="columns-container">
            <div className="main-column">
              <TrendCard {...trendCardProps} maxRows={2} />
            </div>
          </div>
          <ListCard
            content={collectionCardPropsList
              .slice(0, 20)
              .map((collectionCardProps) => (
                <CollectionCard
                  {...collectionCardProps}
                  width={widthCollectionCard}
                />
              ))}
            title={
              <div className="card-header">
                <div className="title">
                  <Trans>Featured collections</Trans>
                </div>
                {/* <SecondaryButton>
                  <Trans>See all</Trans>
                </SecondaryButton> */}
              </div>
            }
            className="collections"
            noCard={true}
            direction="horizontal"
          />
          <ListCard
            content={(isLoadingMore
              ? resourceCardPropsList
              : resourceCardPropsList
            )
              .slice(0, numResources)
              .map((resourceCardProps) => (
                <ResourceCard {...resourceCardProps} />
              ))}
            title={
              <div className="card-header">
                <div className="title">
                  <Trans>Featured resources</Trans>
                </div>
                {/* <SecondaryButton>
                  <Trans>See all</Trans>
                </SecondaryButton> */}
              </div>
            }
            className="resources"
            noCard={true}
            minGrid={300}
          />
          {loadMoreResources && (
            <div className="load-more">
              <SecondaryButton
                onClick={() => {
                  setIsLoadingMore(true)
                  loadMoreResources()
                }}
                color="grey"
              >
                <Trans>Load more</Trans>
              </SecondaryButton>
            </div>
          )}
          {/* <div className="content">
            <div className="main-column">
            </div>
            <div className="side-column"><TrendCard {...trendCardProps} /></div>
          </div> */}
        </div>
      </HeaderPageTemplate>
    )
  }
)

Landing.displayName = 'LandingPage'
