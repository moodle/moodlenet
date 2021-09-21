import { Trans } from '@lingui/macro'
import { tagList } from '../../../../elements/tags'
import { withCtrl } from '../../../../lib/ctrl'
import { FollowTag } from '../../../../types'
import './styles.scss'

export type TrendCardProps = {
  tags: FollowTag[]
}

export const TrendCard = withCtrl<TrendCardProps>(({ tags }) => {
  return (
    <div className="trend-card">
      <div className="title">
        <Trans>Trending subjects and collections</Trans>
      </div>
      <div className="content">
        <div className="gradient-bar"></div>
        <div className="tags">{tagList(tags)}</div>
      </div>
    </div>
  )
})
export default TrendCard
