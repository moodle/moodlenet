import { Trans } from '@lingui/macro'
import { Fragment } from 'react'
import PrimaryButton from '../../components/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '../../components/atoms/Searchbox/Searchbox'
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton'
import { BrowserProps } from '../../components/Browser/Browser'
import TextCard from '../../components/molecules/cards/TextCard/TextCard'
import TrendCard, { TrendCardProps } from '../../components/molecules/cards/TrendCard/TrendCard'
import { Href, Link } from '../../elements/link'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { Organization } from '../../types'
import './styles.scss'

export type LandingProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  browserProps: BrowserProps
  trendCardProps: TrendCardProps
  organization: Pick<Organization, 'name' | 'intro'>
  image?: string
  setSearchText(text: string): unknown
  isAuthenticated: boolean
  signUpHref?: Href
}

export const Landing = withCtrl<LandingProps>(
  ({
    headerPageTemplateProps,
    /* browserProps, */ trendCardProps,
    organization,
    image,
    setSearchText,
    isAuthenticated,
    signUpHref,
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

    return (
      <HeaderPageTemplate {...headerPageTemplateProps} hideSearchbox={true}>
        <div className="landing">
          {!isAuthenticated ? (
            <div className="landing-title">
              {organization.name === 'MoodleNet' ? (
                <Fragment>
                  <div className="organization-title">
                    <Trans>Welcome to MoodleNet</Trans>
                  </div>
                  <div className="moodle-title">
                    <Trans>Our global network to share and curate open educational resources</Trans>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className="moodle-title">
                    <Trans>Welome to MoodleNet</Trans>
                  </div>
                  <div className="organization-title">{organization.name}</div>
                </Fragment>
              )}
            </div>
          ) : (
            <></>
          )}
          <TextCard className="intro-card">
            {/* {((!isAuthenticated && organization.name === 'MoodleNet') || organization.name !== 'MoodleNet') && (
              <div className="title">
                <Trans>{organization.introTitle}</Trans>
              </div>
            )} */}
            <div className="content" />
            MoodleNet is currently in Public Beta version, meaning that this site is now live and being tested before
            its official release.\n We encourage you to join the site and become part of the open education movement and
            our community of MoodleNet testers.\n You will then be able to add open educational resources and create
            collections, follow subjects or collections that are relevant to you, plus share resources and collections
            with your Moodle site.\n Should you encounter any bugs, glitches, lack of functionality or other problems,
            please post in the{' '}
            <a href="https://moodle.org/mod/forum/view.php?id=8726" target="_blank" rel="noreferrer">
              MoodleNet community
            </a>{' '}
            or create an issue at{' '}
            <a href="https://tracker.moodle.org/projects/MDLNET/summary" target="_blank" rel="noreferrer">
              MoodleNet Tracker
            </a>
            .\n
            {organization.name !== 'MoodleNet' && image && <img className="text-image" src={image} alt="Background" />}
            <div className="actions">
              {!isAuthenticated && signUpHref && (
                <Link href={signUpHref}>
                  <PrimaryButton>
                    <Trans>Join now</Trans>
                  </PrimaryButton>
                </Link>
              )}
              <a href="https://docs.moodle.org/moodlenet/Main_Page" target="_blank" rel="noreferrer">
                <SecondaryButton color="grey">
                  <Trans>Go to Docs</Trans>
                </SecondaryButton>
              </a>
            </div>
          </TextCard>
          <Searchbox setSearchText={setSearchText} searchText="" placeholder="Search for open educational content" />
          {/* <div className="trends-title"><Trans>Trendy content</Trans></div> */}
          <TrendCard {...trendCardProps} />
          {/* <Browser {...browserProps} /> */}
          <div className="content">
            <div className="main-column">
              {/* {docsCard} */}
              {/**/}
            </div>
            <div className="side-column">{/* <TrendCard {...trendCardProps} /> */}</div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)

Landing.displayName = 'LandingPage'
