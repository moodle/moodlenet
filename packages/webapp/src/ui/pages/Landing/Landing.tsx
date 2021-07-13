import { FC } from 'react'
import { TextCard } from '../../components/cards/TextCard/TextCard'
import { TrendCard, TrendCardProps } from '../../components/cards/TrendCard/TrendCard'
import { WithProps } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { Organization } from '../../types'
import './styles.scss'

export type LandingProps = {
  headerPageTemplateWithProps: WithProps<HeaderPageTemplateProps>
  trendCardWithProps: WithProps<TrendCardProps>
  organization: Pick<Organization, 'name' | 'intro'>
  image: string
}

export const Landing: FC<LandingProps> = ({ headerPageTemplateWithProps, trendCardWithProps, organization, image }) => {
  const [HeaderPageTemplateCtrl, headerPageTemplateProps] = headerPageTemplateWithProps(HeaderPageTemplate)
  const [TrendCardCtrl, trendCardProps] = trendCardWithProps(TrendCard)

  return (
    <HeaderPageTemplateCtrl {...headerPageTemplateProps}>
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
            <TrendCardCtrl {...trendCardProps} />
          </div>
          <div className="side-column">
            <TrendCardCtrl {...trendCardProps} />
          </div>
        </div>
      </div>
    </HeaderPageTemplateCtrl>
  )
}
