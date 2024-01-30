import { useEffect, useMemo, useState } from 'react'
import type { LeaderBoardData } from '../../../../common/expose-def.mjs'
import type { LeaderboardProps } from '../../../ui/exports/ui.mjs'
import { shell } from '../../shell.mjs'

export function useMyLandingPageLeaderBoardHook() {
  const [leaderBoardData, setLeaderBoardData] = useState<LeaderBoardData>()
  useEffect(() => {
    shell.rpc.me('webapp/profile/leader-board-data')().then(setLeaderBoardData)
  }, [])

  const leaderboardProps = useMemo<LeaderboardProps>(() => {
    const props: LeaderboardProps = leaderBoardData
      ? {
          contributors: leaderBoardData.contributors,
        }
      : { contributors: [] }
    return props
  }, [leaderBoardData])

  return leaderboardProps
}
