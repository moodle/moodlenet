
import { Trans } from '@lingui/macro'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import ShareIcon from '@material-ui/icons/Share'
import { useState } from 'react'
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
  description: string
  liked: boolean
}

export const Resource = withCtrl<ResourceProps>(
  ({
    headerPageTemplateProps,
    overallCardProps,
    profileCardProps,
    imageUrl,
    title,
    description,
    liked
  }) => {
    const [likeState, setLikeState] = useState<boolean>(liked)
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="resource">
          <div className="content">
            <div className="main-column">
              <Card>
                <div className="resource-header">
                  <div className="title">{title}</div>
                  <div className="actions">
                    <div className="like" onClick={() => setLikeState(!likeState)}>
                      { likeState ? (
                        <FavoriteIcon style={{color: 'red'}}/>
                      ) : (
                        <FavoriteBorderIcon/>
                      )}
                      <Trans>Like</Trans>
                    </div>
                    <div className="share"><ShareIcon/><Trans>Share</Trans></div>
                  </div>
                </div>
                <img className="image" src={imageUrl} alt="Background" />
                <div className="description">{description}</div>
                {/*<div className="comments"></div>*/}
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
