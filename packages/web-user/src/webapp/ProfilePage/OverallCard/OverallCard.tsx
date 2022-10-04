// import { t, Trans } from '@lingui/macro'
import { Grade, LibraryBooks, PermIdentity } from '@material-ui/icons'
import { Card } from '@moodlenet/component-library/ui.mjs'
import { FC } from 'react'
// import { Href, Link } from '../../../../elements/link'
import './OverallCard.scss'

export type OverallCardProps = {
  followers: number
  resources: number
  // followersHref: Href
  years: number | string
  kudos: number
  hideBorderWhenSmall?: boolean
  noCard?: boolean
  showIcons?: boolean
}

export const OverallCard: FC<OverallCardProps> = ({
  followers,
  resources,
  kudos,
  // followersHref,
  hideBorderWhenSmall,
  showIcons,
  noCard,
}) => {
  return (
    <Card className="overall-card" hideBorderWhenSmall={hideBorderWhenSmall} noCard={noCard}>
      {showIcons ? (
        <div className="overall-container">
          <div className="data">
            <abbr title={/* t */ `Followers`}>
              <PermIdentity />
            </abbr>
            {followers}
          </div>
          <div className="data">
            <abbr title={/* t */ `Kudos`}>
              <Grade />
            </abbr>
            {kudos}
          </div>
          <div className="data">
            <abbr title={/* t */ `Resources`}>
              <LibraryBooks />
            </abbr>
            {resources}
          </div>
        </div>
      ) : (
        <div className="overall-container">
          <div className="data">
            {/* <Link href={followersHref} className="data"> */}
            {followers}
            <span>
              {/* <Trans> */}
              Followers
              {/* </Trans> */}
            </span>
            {/* </Link> */}
          </div>
          <div className="data">
            {kudos}
            <span>
              {/* <Trans> */}
              Kudos
              {/* </Trans> */}
            </span>
          </div>
          <div className="data">
            {resources}
            <span>
              {/* <Trans> */}
              Resources
              {/* </Trans> */}
            </span>
          </div>
        </div>
      )}
      {/*<div className="data">{props.years} years ago<span>Joined</span></div>*/}
    </Card>
  )
}

OverallCard.defaultProps = {
  showIcons: false,
}
