// import { t, Trans } from '@lingui/macro'
import { FC, useContext } from 'react'
import { MainContext } from '../../MainModule'
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
  const { shell } = useContext(MainContext)
  const [, reactApp] = shell.deps
  const { Card, icons } = reactApp.ui.components
  const { Grade: GradeIcon, LibraryBooks: LibraryBooksIcon, PermIdentity: PermIdentityIcon } = icons

  return (
    <Card className="overall-card" hideBorderWhenSmall={hideBorderWhenSmall} noCard={noCard}>
      {showIcons ? (
        <div className="overall-container">
          <div className="data">
            <abbr title={/* t */ `Followers`}>
              <PermIdentityIcon />
            </abbr>
            {followers}
          </div>
          <div className="data">
            <abbr title={/* t */ `Kudos`}>
              <GradeIcon />
            </abbr>
            {kudos}
          </div>
          <div className="data">
            <abbr title={/* t */ `Resources`}>
              <LibraryBooksIcon />
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
