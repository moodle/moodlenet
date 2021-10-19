import { Trans } from '@lingui/macro'
import { Fragment, useState } from 'react'
import PrimaryButton from '../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import ResourceCard, { ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import ListCard from '../../components/molecules/cards/ListCard/ListCard'
import TextCard from '../../components/molecules/cards/TextCard/TextCard'
import { TrendCardProps } from '../../components/molecules/cards/TrendCard/TrendCard'
import { Href, Link } from '../../elements/link'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { Organization } from '../../types'
import './styles.scss'

export type LandingProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  collectionCardPropsList: CP<CollectionCardProps>[]
  resourceCardPropsList: CP<ResourceCardProps>[]
  trendCardProps: TrendCardProps
  organization: Pick<Organization, 'name' | 'intro'>
  image?: string
  //setSearchText(text: string): unknown
  isAuthenticated: boolean
  signUpHref?: Href
  loadMoreResources?: (() => unknown) | null
}

export const Landing = withCtrl<LandingProps>(
  ({
    headerPageTemplateProps,
    //trendCardProps,
    collectionCardPropsList,
    resourceCardPropsList,
    organization,
    image,
    isAuthenticated,
    signUpHref,
    loadMoreResources,
    //setSearchText,
  }) => {
    /* const docsCard = (
      <TextCard className="intro-card">
        <Trans>MoodleNet is currently in Beta version. Learn more about MoodleNet in our Docs.</Trans>
        <a href="https://docs.moodle.org/moodlenet/Main_Page" target="_blank" rel="noreferrer">
          <SecondaryButton>
            <Trans>Go to Docs</Trans>
          </SecondaryButton>
        </a>
      </TextCard>
    ) */

    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)

    return (
      <HeaderPageTemplate {...headerPageTemplateProps} hideSearchbox={false}>
        <div className="landing">
          <div className="landing-title">
            {organization.name === 'MoodleNet' ? (
              <Fragment>
                <div className="organization-title">
                  {!isAuthenticated ? <Trans>Welcome to MoodleNet</Trans> : <Trans>MoodleNet Central</Trans>}
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
          <TextCard className="intro-card">
            <div className="content">
              <p>
                MoodleNet is currently in Public Beta version, meaning that this site is now live and being tested
                before its official release.
              </p>
              <p>
                We encourage you to join the site and become part of the open education movement and our community of
                MoodleNet testers.
              </p>
              <p>
                {' '}
                You will then be able to add open educational resources and create collections, follow subjects or
                collections that are relevant to you, plus share resources and collections with your Moodle site.
              </p>
              <p>
                {' '}
                Should you encounter any bugs, glitches, lack of functionality or other problems, please post in the{' '}
                <a href="https://moodle.org/mod/forum/view.php?id=8726" target="_blank" rel="noreferrer">
                  MoodleNet community
                </a>{' '}
                or create an issue at{' '}
                <a href="https://tracker.moodle.org/projects/MDLNET/summary" target="_blank" rel="noreferrer">
                  MoodleNet Tracker
                </a>
                .
              </p>
            </div>
            {organization.name !== 'MoodleNet' && image && <img className="text-image" src={image} alt="Background" />}
            <div className="actions">
              {!isAuthenticated && (
                <Link href={signUpHref}>
                  <PrimaryButton>
                    <Trans>Join now</Trans>
                  </PrimaryButton>
                </Link>
              )}
              {/* <a
                className="academy-button"
                href="https://moodle.academy/course/view.php?id=13"
                target="_blank"
                rel="noreferrer"
              >
                <SecondaryButton color="orange">
                  <img src={AcademyLogo} />
                </SecondaryButton>
              </a> */}
              <a href="https://docs.moodle.org/moodlenet/Main_Page" target="_blank" rel="noreferrer">
                <SecondaryButton color="grey">
                  <Trans>Go to Docs</Trans>
                </SecondaryButton>
              </a>
            </div>
          </TextCard>
          {/* <Searchbox setSearchText={setSearchText} searchText="" placeholder="Search for open educational content" /> */}
          {/* <div className="trends-title"><Trans>Trendy content</Trans></div> */}
          {/* <TrendCard {...trendCardProps} /> */}
          <ListCard
            content={collectionCardPropsList.slice(0, 14).map(collectionCardProps => (
              <CollectionCard {...collectionCardProps} />
            ))}
            title={
              <div className="card-header">
                <div className="title">
                  <Trans>Latest collections</Trans>
                </div>
                <SecondaryButton>
                  <Trans>See all</Trans>
                </SecondaryButton>
              </div>
            }
            className="collections"
            noCard={true}
            direction="horizontal"
          />
          <ListCard
            content={(isLoadingMore ? resourceCardPropsList : resourceCardPropsList.slice(0, 12)).map(resourcesCardProps => (
              <ResourceCard {...resourcesCardProps} />
            ))}
            title={
              <div className="card-header">
                <div className="title">
                  <Trans>Latest resources</Trans>
                </div>
                <SecondaryButton>
                  <Trans>See all</Trans>
                </SecondaryButton>
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
