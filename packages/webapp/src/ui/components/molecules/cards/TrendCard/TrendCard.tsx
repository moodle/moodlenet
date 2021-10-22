import { Trans } from '@lingui/macro'
import { useCallback, useEffect, useRef, useState } from 'react'
import { tagList } from '../../../../elements/tags'
import { withCtrl } from '../../../../lib/ctrl'
import { FollowTag } from '../../../../types'
import './styles.scss'

export type TrendCardProps = {
  tags: FollowTag[]
  maxRows?: number
}

export const TrendCard = withCtrl<TrendCardProps>(({ tags, maxRows }) => {
  const [numRows, setNumRows] = useState<number | undefined>(maxRows)
  const card = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (maxRows) {
      const height = content.current?.clientHeight
      const numRows = height && Math.floor(height / 39)
      maxRows && numRows && maxRows < numRows && setNumRows(numRows)
      console.log(maxRows, ' ', numRows, ' ', maxRows && numRows && maxRows < numRows)
    }
  }, [content, maxRows])

  const setNewNumRows = useCallback(() => {
    const containerHeight = card.current && card.current.clientHeight - 78 // 41px is the header height
    const numRows = containerHeight && Math.floor(containerHeight / 39)
    numRows && setNumRows(numRows)
  }, [card])

  useEffect(() => {
    !maxRows && setNewNumRows()
  }, [setNewNumRows, card, maxRows])

  useEffect(() => {
    if (!maxRows) {
      window.addEventListener('resize', setNewNumRows)
      return () => {
        window.removeEventListener('resize', setNewNumRows)
      }
    }
  }, [setNewNumRows, maxRows])

  return (
    <div className={`trend-card max-rows-${numRows}`} ref={card}>
      <div className="title">
        <Trans>Trending subjects and collections</Trans>
      </div>
      <div className="content" ref={content}>
        <div className="gradient-bar"></div>
        <div className={`tags max-rows-${numRows}`}>{tagList(tags)}</div>
      </div>
    </div>
  )
})
export default TrendCard
