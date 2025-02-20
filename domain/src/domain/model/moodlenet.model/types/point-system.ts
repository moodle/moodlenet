import { i_nat, i_pos } from '@moodle/lib-types'

export type pointSystem = {
  welcomePoints: i_nat
  pointBadgeSteps: pointBadgeSteps
  curation: {
    like: {
      toActor: {
        points: i_nat
      }
      toTargetEntityCreator: {
        points: i_nat
      }
      toTargetEntity: {
        popularity: i_nat
      }
    }
    bookmark: {
      toActor: {
        points: i_nat
      }
      toTargetEntityCreator: {
        points: i_nat
      }
      toTargetEntity: {
        popularity: i_nat
      }
    }
  }
  contribution: {
    resource: {
      // perMetaDataField: { points__: 1 },
      published: {
        toCreator: {
          points: i_nat
        }
      }
    }
    collection: {
      published: {
        toCreator: {
          points: i_nat
        }
      }
      // perMetaDataField: { points__: 1 },
      listCuration: {
        toCollectionCreator: {
          points: i_nat
        }
        toResourceCreator: {
          points: i_nat
        }
        toResource: {
          popularity: i_nat
        }
      }
    }
  }
  engagement: {
    // resource: {
    //   updateMeta: { toCreator: { points__: 5 } },
    // },
    // collection: {
    //   updateMeta: { toCreator: { points__: 5 } },
    // },
    profile: {
      welcome: {
        points: i_nat
      }
      contributor: {
        points: i_nat
      }
      interestsSet: {
        points: i_nat
      }
      perMetaDataField: {
        points: i_nat
      }
    }
    follow: {
      followerProfile: {
        points: i_nat
      }
      followingProfile: {
        points: i_nat
      }
      entityCreatorProfile: {
        points: i_nat
      }
      entity: {
        popularity: i_nat
      }
    }
  }
}
type pointBadgeStep = {
  title: string
  lessThanPoints: i_pos
}
type highestBadgeStep = {
  title: string
  lessThanPoints?: null | i_pos
}

export type pointBadgeSteps = [
  pointBadgeStep,
  pointBadgeStep,
  pointBadgeStep,
  pointBadgeStep,
  pointBadgeStep,
  pointBadgeStep,
  pointBadgeStep,
  pointBadgeStep,
  pointBadgeStep,
  highestBadgeStep,
]
