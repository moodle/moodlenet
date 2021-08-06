
import { Trans } from '@lingui/macro'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import ShareIcon from '@material-ui/icons/Share'
import Card from '../../components/atoms/Card/Card'
import { OverallCard, OverallCardProps } from '../../components/cards/OverallCard/OverallCard'
import { ProfileCard, ProfileCardProps } from '../../components/cards/ProfileCard/ProfileCard'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

export type ResourceProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  overallCardProps: OverallCardProps
  profileCardProps: ProfileCardProps
  imageUrl: string 
  title: string
}

export const Resource = withCtrl<ResourceProps>(
  ({
    headerPageTemplateProps,
    overallCardProps,
    profileCardProps,
    imageUrl,
    title
  }) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="resource">
          <div className="content">
            <div className="main-column">
              <Card>
                <div className="resource-header">
                  <div className="title">{title}</div>
                  <div className="actions">
                    <div className="like"><span hidden><FavoriteIcon/></span><FavoriteBorderIcon/><Trans>Like</Trans></div>
                    <div className="share"><ShareIcon/><Trans>Share</Trans></div>
                  </div>
                </div>
                <img className="image" src={imageUrl} alt="Background" />
              </Card>
              <ProfileCard {...profileCardProps} />
            </div>
            <div className="side-column">
              <OverallCard {...overallCardProps} />
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)
Resource.displayName = 'ResourcePage'
