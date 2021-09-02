import { Trans } from '@lingui/macro'
import { Link } from '../../../elements/link'
import { withCtrl } from '../../../lib/ctrl'
import { FollowTag } from '../../../types'
import './styles.scss'

export type TrendCardProps = {
  tags: FollowTag[]
}

export const TrendCard = withCtrl<TrendCardProps>(({ tags }) => {
  const tagList = tags.map((value, index) => {
    return (
      <Link href={value.subjectHomeHref}>
        <div key={index} className={'tag tag' + value.type}>
          {value.name}
        </div>
      </Link>
    )
  })

  return (
    <div className="trend-card">
      <div className="title">
        <Trans>Trending Subjects Collections</Trans>
      </div>
      <div className="content">
        <div className="gradient-bar"></div>
        <div className="tags">{tagList}</div>
      </div>
    </div>
  )
})
export default TrendCard
