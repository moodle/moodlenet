import { configs } from '../types'

export const moodlenet_default_configs: configs = {
  siteInfo: {
    title: 'Search for resources, subjects, collections or people',
    subtitle: 'Find, share and curate open educational resources',
  },
  moodlenetPrimaryMsgSchemaConfigs: {
    siteInfo: {
      subtitle: { max: 200, min: 3 },
      title: { max: 100, min: 3 },
    },
  },
  eduPublishPrimaryMsgSchemaConfigOverrides: {
    eduCollectionMeta: {
      description: { min: 15 },
      title: { min: 5 },
    },
    eduResourceMeta: {
      description: { min: 15 },
      title: { min: 5 },
      iscedField: { required: true },
      iscedLevel: { required: true },
      type: { required: true },
      language: { required: true },
      license: { required: true },
      publicationDate: { required: true },
      bloomLearningOutcomes: {
        amount: { min: 1 },
        sentence: { min: 10 },
      },
    },
  },
  pointSystem: {
    welcomePoints: nat_int(5),
    curation: {
      like: {
        toActor: { points: nat_int(1) },
        toTargetEntityCreator: { points: nat_int(1) },
        toTargetEntity: { popularity: nat_int(1) },
      },
      bookmark: {
        toActor: { points: nat_int(1) },
        toTargetEntityCreator: { points: nat_int(1) },
        toTargetEntity: { popularity: nat_int(1) },
      },
    },
    contribution: {
      resource: {
        // perMetaDataField: { points__: 1 },
        published: { toCreator: { points: nat_int(20) } },
      },
      collection: {
        published: { toCreator: { points: nat_int(5) } },
        // perMetaDataField: { points__: 1 },
        listCuration: {
          toCollectionCreator: { points: nat_int(5) },
          toResourceCreator: { points: nat_int(5) },
          toResource: { popularity: nat_int(1) },
        },
      },
    },
    engagement: {
      // resource: {
      //   updateMeta: { toCreator: { points__: 5 } },
      // },
      // collection: {
      //   updateMeta: { toCreator: { points__: 5 } },
      // },
      profile: {
        welcome: { points: nat_int(5) },
        contributor: { points: nat_int(10) },
        interestsSet: { points: nat_int(5) },
        perMetaDataField: { points: nat_int(1) },
      },
      follow: {
        followerProfile: { points: nat_int(5) },
        followingProfile: { points: nat_int(5) },
        entityCreatorProfile: { points: nat_int(5) },
        entity: { popularity: nat_int(1) },
      },
    },
    pointBadgeSteps: [
      { lessThanPoints: pos_int(15), title: 'Ambitious seed' },
      { lessThanPoints: pos_int(75), title: 'Determined sprout' },
      { lessThanPoints: pos_int(250), title: 'Rooted learner' },
      { lessThanPoints: pos_int(500), title: 'Seedling scholar' },
      { lessThanPoints: pos_int(1500), title: 'Steady grower' },
      { lessThanPoints: pos_int(5000), title: 'Photosynthesizer' },
      { lessThanPoints: pos_int(15000), title: 'Sky reacher' },
      { lessThanPoints: pos_int(50000), title: 'Firmly grounded' },
      { lessThanPoints: pos_int(100000), title: 'Versatile canopy' },
      { title: 'Dazzling biome' },
    ],
  },
}
