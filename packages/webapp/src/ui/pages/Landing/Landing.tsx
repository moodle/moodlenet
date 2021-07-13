import { FC } from 'react'
import { TextCard } from '../../components/cards/TextCard/TextCard'
import { TrendCard, TrendCardProps } from '../../components/cards/TrendCard/TrendCard'
import { WithProps } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { Organization } from '../../types'
import './styles.scss'

export type LandingProps = {
  withHeaderPageTemplateProps: WithProps<HeaderPageTemplateProps>
  withTrendCardProps: WithProps<TrendCardProps>
  organization: Pick<Organization, 'name' | 'intro'>
  image: string
}

export const Landing: FC<LandingProps> = ({ withHeaderPageTemplateProps, withTrendCardProps, organization, image }) => {
  const [HeaderPageTemplateWithProps, headerPageTemplateProps] = withHeaderPageTemplateProps(HeaderPageTemplate)
  const [TrendCardWithProps, trendCardProps] = withTrendCardProps(TrendCard)

  return (
    <HeaderPageTemplateWithProps {...headerPageTemplateProps}>
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
            <TrendCardWithProps {...trendCardProps} />
          </div>
          <div className="side-column">
            <TrendCardWithProps {...trendCardProps} />
          </div>
        </div>
      </div>
    </HeaderPageTemplateWithProps>
  )
}
