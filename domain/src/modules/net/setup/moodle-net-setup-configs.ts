import { non_negative_integer_schema, positive_integer_schema } from '@moodle/lib-types'
import { configs } from '../types'
import { eduIscedFieldsSetup, eduIscedLevelsSetup, eduResourceTypesSetup } from '../../edu/setup'
import { contentLanguages_iso_639_3_Setup, contentLicensesSetup } from '../../content/setup'

export const net_default_configs: configs = {
  info: {
    title: 'Search for resources, subjects, collections or people',
    subtitle: 'Find, share and curate open educational resources',
  },
  moodlenetPrimaryMsgSchemaConfigs: {
    info: {
      subtitle: { max: 200, min: 3 },
      title: { max: 100, min: 3 },
    },
  },
  pointSystem: {
    welcomePoints: non_negative_integer_schema.parse(5),
    curation: {
      like: {
        toActor: { points: non_negative_integer_schema.parse(1) },
        toTargetEntityCreator: { points: non_negative_integer_schema.parse(1) },
        toTargetEntity: { popularity: non_negative_integer_schema.parse(1) },
      },
      bookmark: {
        toActor: { points: non_negative_integer_schema.parse(1) },
        toTargetEntityCreator: { points: non_negative_integer_schema.parse(1) },
        toTargetEntity: { popularity: non_negative_integer_schema.parse(1) },
      },
    },
    contribution: {
      resource: {
        // perMetaDataField: { points__: 1 },
        published: { toCreator: { points: non_negative_integer_schema.parse(20) } },
      },
      collection: {
        published: { toCreator: { points: non_negative_integer_schema.parse(5) } },
        // perMetaDataField: { points__: 1 },
        listCuration: {
          toCollectionCreator: { points: non_negative_integer_schema.parse(5) },
          toResourceCreator: { points: non_negative_integer_schema.parse(5) },
          toResource: { popularity: non_negative_integer_schema.parse(1) },
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
        welcome: { points: non_negative_integer_schema.parse(5) },
        publisher: { points: non_negative_integer_schema.parse(10) },
        interestsSet: { points: non_negative_integer_schema.parse(5) },
        perMetaDataField: { points: non_negative_integer_schema.parse(1) },
      },
      follow: {
        followerProfile: { points: non_negative_integer_schema.parse(5) },
        followedProfile: { points: non_negative_integer_schema.parse(5) },
        entityCreatorProfile: { points: non_negative_integer_schema.parse(5) },
        entity: { popularity: non_negative_integer_schema.parse(1) },
      },
    },
    pointBadgeSteps: [
      { lessThanPoints: positive_integer_schema.parse(15), title: 'Ambitious seed' },
      { lessThanPoints: positive_integer_schema.parse(75), title: 'Determined sprout' },
      { lessThanPoints: positive_integer_schema.parse(250), title: 'Rooted learner' },
      { lessThanPoints: positive_integer_schema.parse(500), title: 'Seedling scholar' },
      { lessThanPoints: positive_integer_schema.parse(1500), title: 'Steady grower' },
      { lessThanPoints: positive_integer_schema.parse(5000), title: 'Photosynthesizer' },
      { lessThanPoints: positive_integer_schema.parse(15000), title: 'Sky reacher' },
      { lessThanPoints: positive_integer_schema.parse(50000), title: 'Firmly grounded' },
      { lessThanPoints: positive_integer_schema.parse(100000), title: 'Versatile canopy' },
      { title: 'Dazzling biome' },
    ],
  },
  publishedCategories: {
    eduIscedFields: { id: eduIscedFieldsSetup.filter(({ codePath }) => codePath.length === 3).map(({ id }) => id) },
    eduIscedLevels: { id: eduIscedLevelsSetup.map(({ id }) => id) },
    eduResourceTypes: { id: eduResourceTypesSetup.map(({ id }) => id) },
    contentLanguages: { id: contentLanguages_iso_639_3_Setup.filter(({ part1 }) => !!part1).map(({ id }) => id) },
    contentLicenses: { id: contentLicensesSetup.map(({ id }) => id) },
  },
}
