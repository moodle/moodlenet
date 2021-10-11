import { Trans } from '@lingui/macro'
import PrimaryButton from '../../components/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '../../components/atoms/Searchbox/Searchbox'
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton'
import TextCard from '../../components/molecules/cards/TextCard/TextCard'
import { TrendCard, TrendCardProps } from '../../components/molecules/cards/TrendCard/TrendCard'
import { Href, Link } from '../../elements/link'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { Organization } from '../../types'
import './styles.scss'

export type LandingProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  trendCardProps: TrendCardProps
  organization: Pick<Organization, 'name' | 'introTitle' | 'intro'>
  image?: string
  setSearchText(text: string): unknown
  isAuthenticated: boolean
  signUpHref?: Href
}

export const Landing = withCtrl<LandingProps>(
  ({ headerPageTemplateProps, trendCardProps, organization, image, setSearchText, isAuthenticated, signUpHref }) => {
    const docsCard = (
      <TextCard className="intro-card">
        <Trans>MoodleNet is currently in Beta version. Learn more about MoodleNet in our Docs.</Trans>
        <a href="https://docs.moodle.org/moodlenet/Main_Page" target="_blank" rel="noreferrer">
          <SecondaryButton>
            <Trans>Go to Docs</Trans>
          </SecondaryButton>
        </a>
      </TextCard>
    )

    return (
      <HeaderPageTemplate {...headerPageTemplateProps} hideSearchbox={true}>
        <div className="landing">
          {!isAuthenticated ? (
            <div className="landing-title">
              {organization.name === 'MoodleNet' ? (
                <div>
                  <div className="organization-title">
                    <Trans>Welcome to MoodleNet</Trans>
                  </div>
                  <div className="moodle-title">
                    <Trans>Our global network to share and curate open educational resources</Trans>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="moodle-title">
                    <Trans>Welome to MoodleNet</Trans>
                  </div>
                  <div className="organization-title">{organization.name}</div>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
          <Searchbox setSearchText={setSearchText} searchText="" placeholder="Search for open educational content" />
          <div className="content">
            <div className="main-column">
              <TextCard className="intro-card">
                {((!isAuthenticated && organization.name === 'MoodleNet') || organization.name !== 'MoodleNet') && (
                  <div className="title">{organization.introTitle}</div>
                )}
                <div className="content">{organization.intro}</div>
                {organization.name !== 'MoodleNet' && image && (
                  <img className="text-image" src={image} alt="Background" />
                )}
                {!isAuthenticated && signUpHref && (
                  <Link href={signUpHref}>
                    <PrimaryButton>
                      <Trans>Join now</Trans>
                    </PrimaryButton>
                  </Link>
                )}
              </TextCard>
              {docsCard}
              <TrendCard {...trendCardProps} />
            </div>
            <div className="side-column">
              <TrendCard {...trendCardProps} />
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)

Landing.displayName = 'LandingPage'
