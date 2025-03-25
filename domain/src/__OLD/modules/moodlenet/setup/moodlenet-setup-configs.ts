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
    welcomePoints: i_nat(5),
    curation: {
      like: {
        toActor: { points: i_nat(1) },
        toTargetEntityCreator: { points: i_nat(1) },
        toTargetEntity: { popularity: i_nat(1) },
      },
      bookmark: {
        toActor: { points: i_nat(1) },
        toTargetEntityCreator: { points: i_nat(1) },
        toTargetEntity: { popularity: i_nat(1) },
      },
    },
    contribution: {
      resource: {
        // perMetaDataField: { points__: 1 },
        published: { toCreator: { points: i_nat(20) } },
      },
      collection: {
        published: { toCreator: { points: i_nat(5) } },
        // perMetaDataField: { points__: 1 },
        listCuration: {
          toCollectionCreator: { points: i_nat(5) },
          toResourceCreator: { points: i_nat(5) },
          toResource: { popularity: i_nat(1) },
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
        welcome: { points: i_nat(5) },
        contributor: { points: i_nat(10) },
        interestsSet: { points: i_nat(5) },
        perMetaDataField: { points: i_nat(1) },
      },
      follow: {
        followerProfile: { points: i_nat(5) },
        followingProfile: { points: i_nat(5) },
        entityCreatorProfile: { points: i_nat(5) },
        entity: { popularity: i_nat(1) },
      },
    },
    pointBadgeSteps: [
      { lessThanPoints: i_pos(15), title: 'Ambitious seed' },
      { lessThanPoints: i_pos(75), title: 'Determined sprout' },
      { lessThanPoints: i_pos(250), title: 'Rooted learner' },
      { lessThanPoints: i_pos(500), title: 'Seedling scholar' },
      { lessThanPoints: i_pos(1500), title: 'Steady grower' },
      { lessThanPoints: i_pos(5000), title: 'Photosynthesizer' },
      { lessThanPoints: i_pos(15000), title: 'Sky reacher' },
      { lessThanPoints: i_pos(50000), title: 'Firmly grounded' },
      { lessThanPoints: i_pos(100000), title: 'Versatile canopy' },
      { title: 'Dazzling biome' },
    ],
  },
}
