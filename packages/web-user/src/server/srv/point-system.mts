export const pointSystem = {
  account: {
    creation: 5,
    publisherGrant: { gain: 10, loose: -10 },
  },
  featureEntity: {
    resource: {
      like: {
        add: { giver: 1, receiver: 1 },
        remove: { giver: -1, receiver: -1 },
      },
      bookmark: {
        add: { giver: 1, receiver: 1 },
        remove: { giver: -1, receiver: -1 },
      },
      follow: null,
    },
    collection: {
      bookmark: {
        add: { giver: 1, receiver: 1 },
        remove: { giver: -1, receiver: -1 },
      },
      follow: null,
      like: null,
    },
    profile: {
      bookmark: {
        add: { giver: 1, receiver: 1 },
        remove: { giver: -1, receiver: -1 },
      },
      follow: null,
      like: null,
    },
    subject: {
      follow: null,
      bookmark: null,
      like: null,
    },
  },
  contribution: {
    resource: {
      publish: { creator: 20 },
      unpublish: { creator: -20 },
    },
    collection: {
      publish: { creator: 5 },
      unpublish: { creator: -5 },
      resourceInCollection: {
        add: { resourceCreator: 5, collectionCreator: 5 },
        remove: { resourceCreator: -5, collectionCreator: -5 },
      },
    },
  },
}
