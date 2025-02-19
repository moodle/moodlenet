import { nat_int, pos_int } from '@moodle/lib-types'

export type pointSystem = {
  welcomePoints: nat_int
  pointBadgeSteps: pointBadgeSteps
  curation: {
    like: {
      toActor: {
        points: nat_int
      }
      toTargetEntityCreator: {
        points: nat_int
      }
      toTargetEntity: {
        popularity: nat_int
      }
    }
    bookmark: {
      toActor: {
        points: nat_int
      }
      toTargetEntityCreator: {
        points: nat_int
      }
      toTargetEntity: {
        popularity: nat_int
      }
    }
  }
  contribution: {
    resource: {
      // perMetaDataField: { points__: 1 },
      published: {
        toCreator: {
          points: nat_int
        }
      }
    }
    collection: {
      published: {
        toCreator: {
          points: nat_int
        }
      }
      // perMetaDataField: { points__: 1 },
      listCuration: {
        toCollectionCreator: {
          points: nat_int
        }
        toResourceCreator: {
          points: nat_int
        }
        toResource: {
          popularity: nat_int
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
        points: nat_int
      }
      contributor: {
        points: nat_int
      }
      interestsSet: {
        points: nat_int
      }
      perMetaDataField: {
        points: nat_int
      }
    }
    follow: {
      followerProfile: {
        points: nat_int
      }
      followingProfile: {
        points: nat_int
      }
      entityCreatorProfile: {
        points: nat_int
      }
      entity: {
        popularity: nat_int
      }
    }
  }
}
type pointBadgeStep = {
  title: string
  lessThanPoints: pos_int
}
type highestBadgeStep = {
  title: string
  lessThanPoints?: null | pos_int
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
