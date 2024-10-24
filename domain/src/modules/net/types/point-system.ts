import { _nullish, non_negative_integer, positive_integer } from '@moodle/lib-types'

export type pointSystem = {
  welcomePoints: non_negative_integer
  pointBadgeSteps: pointBadgeSteps
  curation: {
    like: {
      toActor: {
        points: non_negative_integer
      }
      toTargetEntityCreator: {
        points: non_negative_integer
      }
      toTargetEntity: {
        popularity: non_negative_integer
      }
    }
    bookmark: {
      toActor: {
        points: non_negative_integer
      }
      toTargetEntityCreator: {
        points: non_negative_integer
      }
      toTargetEntity: {
        popularity: non_negative_integer
      }
    }
  }
  contribution: {
    resource: {
      // perMetaDataField: { points__: 1 },
      published: {
        toCreator: {
          points: non_negative_integer
        }
      }
    }
    collection: {
      published: {
        toCreator: {
          points: non_negative_integer
        }
      }
      // perMetaDataField: { points__: 1 },
      listCuration: {
        toCollectionCreator: {
          points: non_negative_integer
        }
        toResourceCreator: {
          points: non_negative_integer
        }
        toResource: {
          popularity: non_negative_integer
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
        points: non_negative_integer
      }
      publisher: {
        points: non_negative_integer
      }
      interestsSet: {
        points: non_negative_integer
      }
      perMetaDataField: {
        points: non_negative_integer
      }
    }
    follow: {
      followerProfile: {
        points: non_negative_integer
      }
      followingProfile: {
        points: non_negative_integer
      }
      entityCreatorProfile: {
        points: non_negative_integer
      }
      entity: {
        popularity: non_negative_integer
      }
    }
  }
}
type pointBadgeStep = {
  title: string
  lessThanPoints: positive_integer
}
type highestBadgeStep = {
  title: string
  lessThanPoints?: _nullish | positive_integer
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
