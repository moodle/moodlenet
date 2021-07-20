import { Trans } from '@lingui/macro'
import { withCtrl } from '../../../lib/ctrl'
import { FollowTag } from '../../../types'
import './styles.scss'

export type TrendCardProps = {
  tags: FollowTag[]
}

export const TrendCard = withCtrl<TrendCardProps>(({ tags }) => {
  const tagList = tags.map((value, index) => {
    return (
      <div key={index} className={'tag tag' + value.type}>
        {value.name}
      </div>
    )
  })

  return (
    <div className="trend-card">
      <div className="title">
        <Trans>
          Trending Subjects Collections
        </Trans>
      </div>
      <div className="content">
        <div className="gradient-bar"></div>
        <div className="tags">{tagList}</div>
      </div>
    </div>
  )
})
export default TrendCard
