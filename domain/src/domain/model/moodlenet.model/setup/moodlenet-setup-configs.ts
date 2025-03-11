import { i_nat, i_pos } from '@moodle/lib-types'
import { NONE_ASSET } from '../../../../lib'
import { moodlenetConfigs, moodlenetSchemas } from '../types'

export const DEFAULT_MOODLENET_CONFIGS: moodlenetConfigs = {
  info: {
    title: 'Search for resources, subjects, collections or people',
    subtitle: 'Find, share and curate open educational resources',
    logo: NONE_ASSET,
    smallLogo: NONE_ASSET,
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
        published: { toCreator: { points: i_nat(20) } },
      },
      collection: {
        published: { toCreator: { points: i_nat(5) } },
        listCuration: {
          toCollectionCreator: { points: i_nat(5) },
          toResourceCreator: { points: i_nat(5) },
          toResource: { popularity: i_nat(1) },
        },
      },
    },
    engagement: {
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
export const DEFAULT_MOODLENET_SCHEMAS: moodlenetSchemas = {
  publishEduOverrides: {
    collection: {
      description: { min: i_nat(15) },
      title: { min: i_nat(5) },
    },
    resource: {
      description: { min: i_nat(15) },
      title: { min: i_nat(5) },
      iscedField: { required: true },
      iscedLevel: { required: true },
      type: { required: true },
      language: { required: true },
      license: { required: true },
      publicationDate: { required: true },
      bloomLearningOutcomes: {
        amount: { min: i_nat(1) },
        sentence: { min: i_nat(10) },
      },
    },
  },
  moodlenetInfo: {
    subtitle: { max: i_nat(200), min: i_nat(3) },
    title: { max: i_nat(100), min: i_nat(3) },
  },
}
