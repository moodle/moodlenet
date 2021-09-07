import Searchbox from '../../components/atoms/Searchbox/Searchbox'
import { TextCard } from '../../components/cards/TextCard/TextCard'
import { TrendCard, TrendCardProps } from '../../components/cards/TrendCard/TrendCard'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { Organization } from '../../types'
import { useTitle } from '../commons'
import './styles.scss'

export type LandingProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  trendCardProps: TrendCardProps
  organization: Pick<Organization, 'name' | 'intro'>
  image: string
  setSearchText(text: string): unknown
  isAuthenticated: boolean
}

export const Landing = withCtrl<LandingProps>(
  ({ headerPageTemplateProps, trendCardProps, organization, image, setSearchText, isAuthenticated }) => {
    useTitle('MoodleNet')
    return (
      <HeaderPageTemplate {...headerPageTemplateProps} showSearchbox={false}>
        <div className="landing">
          {!isAuthenticated ? (
            <div className="landing-title">
              {organization.name === 'MoodleNet' ? (
                <div>
                  <div className="organization-title">Welcome to MoodleNet</div>
                  <div className="moodle-title">Our global network to share and curate open educational resources</div>
                </div>
              ) : (
                <div>
                  <div className="moodle-title">Welome to MoodleNet</div>
                  <div className="organization-title">{organization.name}</div>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
          <Searchbox setSearchText={setSearchText} searchText="" placeholder="Search for education content" />
          <div className="content">
            <div className="main-column">
              <TextCard>
                <div>{organization.intro}</div>
                {organization.name === 'MoodleNet' ? '' : <img className="text-image" src={image} alt="Background" />}
              </TextCard>
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
