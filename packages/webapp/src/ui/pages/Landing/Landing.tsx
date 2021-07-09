import { FC } from 'react'
import { TextCard } from '../../components/cards/TextCard/TextCard'
import { TrendCard, TrendCardProps } from '../../components/cards/TrendCard/TrendCard'
import { HeaderPageTemplate } from '../../templates/page/HeaderPageTemplate'
import { Organization } from '../../types'
import { PageHeaderProps } from '../PageHeader/PageHeader'
import './styles.scss'

export type LandingProps = {
  pageHeaderProps: PageHeaderProps
  trendCardProps: TrendCardProps
  organization: Pick<Organization,  "name" | "intro">
  image: string
}

export const Landing: FC<LandingProps> = ({
  pageHeaderProps,
  trendCardProps,
  organization,
  image
}) => {
  return (
    <HeaderPageTemplate pageHeaderProps={pageHeaderProps}>
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
                <span style={{color: '#b6bacb'}}>Welcome!</span>
              </div>
              <img className="text-image" src={image} alt="Background"/>
            </TextCard>
            <TrendCard {...trendCardProps}></TrendCard>
          </div>
          <div className="side-column">
            <TrendCard {...trendCardProps}></TrendCard>
          </div>
        </div>
      </div>
    </HeaderPageTemplate>
  )
}
