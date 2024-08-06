import semverRCompare from 'semver/functions/rcompare'
import semverValid from 'semver/functions/valid'
import { Version, VersionLadder } from './types'

export const climbLadder = (ladder: VersionLadder, from: Version, dir: 'up' | 'down') => {
  const ladderVersionsSorted = getLadderVersionSorted(ladder)

  const currVersionIndex = ladderVersionsSorted.indexOf(from)
  const requestedVersion = ladderVersionsSorted[currVersionIndex + (dir === 'up' ? -1 : 1)] as Version | undefined
  if (!requestedVersion) {
    return null
  }
  return [requestedVersion, ladder[requestedVersion]!] as const
}

export const getLadderVersionSorted = (ladder: VersionLadder) => {
  const ladderVersionsStrs = Object.keys(ladder)
  const invalidSemvers = ladderVersionsStrs.filter(_ => !semverValid(_))
  if (invalidSemvers.length) {
    throw new Error(`Ladder contains invalid semvers : ${invalidSemvers.join(' ; ')}`)
  }
  const ladderVersionsSorted = Object.keys(ladder).sort(semverRCompare)
  console.log(`ladder versions: ${ladderVersionsSorted.join(' | ')}`)

  return ladderVersionsSorted as Version[]
}
