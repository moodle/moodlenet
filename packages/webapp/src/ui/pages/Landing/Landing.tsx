import { TextCard } from '../../components/cards/TextCard/TextCard'
import { TrendCard, TrendCardProps } from '../../components/cards/TrendCard/TrendCard'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { Organization } from '../../types'
import './styles.scss'

export type LandingProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  trendCardProps: TrendCardProps
  organization: Pick<Organization, 'name' | 'intro'>
  image: string
}

export const Landing = withCtrl<LandingProps>(({ headerPageTemplateProps, trendCardProps, organization, image }) => {
  return (
    <HeaderPageTemplate {...headerPageTemplateProps}>
      <div className="landing">
        <div className="landing-title">
          <div className="moodle-title">Welcome to MoodleNet</div>
          <div className="organization-title">{organization.name}</div>
        </div>
        <div className="content">
          <div className="main-column">
            <TextCard>
              <div>
                {organization.intro}
                <span style={{ color: '#b6bacb' }}>Welcome!</span>
              </div>
              <img className="text-image" src={image} alt="Background" />
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
})

Landing.displayName = 'LandingPage'
