export const pointSystem = {
  curation: {
    like: {
      toActor: { points: 1 },
      toTargetEntityCreator: { points: 1 },
      toTargetEntity: { popularity: 1 },
    },
    bookmark: {
      toActor: { points: 1 },
      toTargetEntityCreator: { points: 1 },
      toTargetEntity: { popularity: 1 },
    },
  },
  contribution: {
    resource: {
      perMetaDataField: { points: 1 },
      published: { toCreator: { points: 20 } },
    },
    collection: {
      published: { toCreator: { points: 5 } },
      perMetaDataField: { points: 1 },
      listCuration: {
        toCollectionCreator: { points: 5 },
        toResourceCreator: { points: 5 },
        toResource: { popularity: 1 },
      },
    },
  },
  engagement: {
    // resource: {
    //   updateMeta: { toUpdater: { points_: 5 } },
    // },
    // collection: {
    //   updateMeta: { toUpdater: { points_: 5 } },
    // },
    profile: {
      creation: { points: 5 },
      publisher: { points: 10 },
      interestsSet: { points: 5 },
      perMetaDataField: { points: 1 },
    },
    follow: {
      followerProfile: { points: 5 },
      followedProfile: { points: 5 },
      entityCreatorProfile: { points: 5 },
      entity: { popularity: 1 },
    },
  },
} as const
