import { Trans } from '@lingui/macro'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getElementSize } from '../../../../../helpers/utilities'
import { getTagList } from '../../../../elements/tags'
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
  const title = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const margin = 18

  useEffect(() => {
    if (maxRows) {
      const height = content.current?.clientHeight
      const numRows = height && Math.floor(height / 39)
      maxRows && numRows && maxRows < numRows && setNumRows(numRows)
    }
  }, [content, maxRows])

  const setNewNumRows = useCallback(() => {
    const containerTakenSpace =
      title.current && getElementSize(title.current).height + margin * 2
    const containerHeight =
      card.current &&
      card.current.clientHeight -
        (containerTakenSpace ? containerTakenSpace : 0)
    const numRows = containerHeight && Math.floor(containerHeight / 39)
    maxRows && !numRows && setNumRows(maxRows)
    maxRows && numRows && setNumRows(maxRows <= numRows ? maxRows : numRows)
    numRows && setNumRows(numRows)
  }, [card, maxRows])

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
    return
  }, [setNewNumRows, maxRows])

  return (
    <div className={`trend-card max-rows-${numRows}`} ref={card}>
      <div className="title" ref={title}>
        <Trans>Trending subjects</Trans>
      </div>
      <div className="content" ref={content}>
        <div className="gradient-bar"></div>
        <div className={`tags hover max-rows-${numRows}`}>
          {getTagList(tags, 'medium')}
        </div>
      </div>
    </div>
  )
})
export default TrendCard
