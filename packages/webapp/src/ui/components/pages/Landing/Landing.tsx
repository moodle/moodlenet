import { t, Trans } from '@lingui/macro'
import { Fragment, useState } from 'react'
import { Href, Link } from '../../../elements/link'
import { CP, withCtrl } from '../../../lib/ctrl'
import { Organization } from '../../../types'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import Searchbox from '../../atoms/Searchbox/Searchbox'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import { CollectionCard, CollectionCardProps } from '../../molecules/cards/CollectionCard/CollectionCard'
import ListCard from '../../molecules/cards/ListCard/ListCard'
import ResourceCard, { ResourceCardProps } from '../../molecules/cards/ResourceCard/ResourceCard'
import TextCard from '../../molecules/cards/TextCard/TextCard'
import TrendCard, { TrendCardProps } from '../../molecules/cards/TrendCard/TrendCard'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/HeaderPageTemplate'
import './styles.scss'

export type LandingProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  collectionCardPropsList: CP<CollectionCardProps>[]
  resourceCardPropsList: CP<ResourceCardProps>[]
  trendCardProps: TrendCardProps
  organization: Pick<Organization, 'name' | 'intro'>
  image?: string
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
    image,
    isAuthenticated,
    signUpHref,
    loadMoreResources,
    setSearchText,
  }) => {
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)

    return (
      <HeaderPageTemplate {...headerPageTemplateProps} hideSearchbox={true}>
        <div className="landing">
          <div className="landing-header">
            <div className="landing-title">
              {organization.name === 'MoodleNet' ? (
                <Fragment>
                  <div className="organization-title">
                    {!isAuthenticated ? <Trans>Welcome to MoodleNet Central</Trans> : <Trans>MoodleNet Central</Trans>}
                  </div>
                  {!isAuthenticated && (
                    <div className="moodle-title">
                      <Trans>Our global network to share and curate open educational resources</Trans>
                    </div>
                  )}
                </Fragment>
              ) : (
                <Fragment>
                  {!isAuthenticated && (
                    <div className="moodle-title">
                      <Trans>Welome to MoodleNet</Trans>
                    </div>
                  )}
                  <div className="organization-title">{organization.name}</div>
                </Fragment>
              )}
            </div>
            <Searchbox
              size="big"
              setSearchText={setSearchText}
              searchText=""
              placeholder={t`Search for open educational content`}
            />
          </div>
          <div className="columns-container">
            <div className="main-column">
              <TextCard className="intro-card">
                <p>
                  MoodleNet is currently in Public Beta version, meaning that this site is now live and being tested
                  before its official release.
                </p>
                <p>
                  Feel free to add open educational resources and collections, follow subjects and collections plus send
                  resources to your Moodle site.
                </p>
                {organization.name !== 'MoodleNet' && image && (
                  <img className="text-image" src={image} alt="Background" />
                )}
                <div className="actions">
                  {!isAuthenticated && (
                    <Link href={signUpHref}>
                      <PrimaryButton>
                        <Trans>Join now</Trans>
                      </PrimaryButton>
                    </Link>
                  )}
                  <a href="https://docs.moodle.org/moodlenet/Main_Page" target="_blank" rel="noreferrer">
                    <SecondaryButton color="grey">
                      <Trans>Learn more</Trans>
                    </SecondaryButton>
                  </a>
                </div>
              </TextCard>
              <TrendCard {...trendCardProps} maxRows={2} />
            </div>
            <div className="side-column">
              {/* <div className="trends-title"><Trans>Trendy content</Trans></div> */}
              <TrendCard {...trendCardProps} />
            </div>
          </div>
          <ListCard
            content={collectionCardPropsList.slice(0, 14).map(collectionCardProps => (
              <CollectionCard {...collectionCardProps} />
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
            content={(isLoadingMore ? resourceCardPropsList : resourceCardPropsList.slice(0, 12)).map(
              resourcesCardProps => (
                <ResourceCard {...resourcesCardProps} />
              ),
            )}
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
  },
)

Landing.displayName = 'LandingPage'
