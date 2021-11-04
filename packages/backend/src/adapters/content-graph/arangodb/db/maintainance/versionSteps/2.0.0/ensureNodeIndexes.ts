import { DocumentCollection } from 'arangojs/collection'

export async function ensureNodeIndexes(collection: DocumentCollection, nodeCollName: string) {
  await collection.ensureIndex({
    type: 'hash',
    sparse: true,
    name: 'authKey',
    fields: ['_authKey'],
  })
  await collection.ensureIndex({
    type: 'hash',
    name: 'type',
    fields: ['_type'],
  })
  await collection.ensureIndex({
    type: 'hash',
    unique: true,
    name: 'slug',
    fields: ['_slug'],
  })
  await collection.ensureIndex({
    type: 'persistent',
    name: 'published',
    fields: ['_published'],
  })
  await collection.ensureIndex({
    type: 'persistent',
    name: 'local',
    fields: ['_local'],
  })
  await collection.ensureIndex({
    type: 'persistent',
    name: 'created',
    fields: ['_created'],
  })
  await collection.ensureIndex({
    type: 'persistent',
    name: 'edited',
    fields: ['_edited'],
  })

  await collection.ensureIndex({
    type: 'fulltext',
    name: 'name',
    fields: ['name'],
  })
  await collection.ensureIndex({
    type: 'fulltext',
    name: 'description',
    fields: ['description'],
  })

  if (nodeCollName === 'Resource') {
    await collection.ensureIndex({
      type: 'hash',
      name: 'kind',
      fields: ['kind'],
    })
    await collection.ensureIndex({
      type: 'persistent',
      name: 'originalCreationDate',
      fields: ['originalCreationDate'],
    })
  }
  if (nodeCollName === 'Organization') {
    await collection.ensureIndex({
      type: 'fulltext',
      name: 'domain',
      fields: ['domain'],
    })
    await collection.ensureIndex({
      type: 'fulltext',
      name: 'intro',
      fields: ['intro'],
    })
  }
  if (nodeCollName === 'Profile') {
    await collection.ensureIndex({
      type: 'fulltext',
      name: 'firstName',
      fields: ['firstName'],
    })
    await collection.ensureIndex({
      type: 'fulltext',
      name: 'lastName',
      fields: ['lastName'],
    })
    await collection.ensureIndex({
      type: 'fulltext',
      name: 'bio',
      fields: ['bio'],
    })
  }
  if (nodeCollName === 'Language') {
    await collection.ensureIndex({
      type: 'persistent',
      unique: true,
      name: 'part1',
      sparse: true,
      fields: ['part1'],
    })
  }

  if (
    nodeCollName === 'IscedField' ||
    nodeCollName === 'IscedGrade' ||
    nodeCollName === 'FileFormat' ||
    nodeCollName === 'ResourceType'
  ) {
    await collection.ensureIndex({
      type: 'persistent',
      unique: true,
      name: 'code',
      fields: ['code'],
    })

    if (nodeCollName === 'IscedField' || nodeCollName === 'IscedGrade') {
      await collection.ensureIndex({
        type: 'hash',
        unique: true,
        name: 'codePath',
        fields: ['codePath'],
      })
      await collection.ensureIndex({
        type: 'hash',
        name: 'codePathParts',
        fields: ['codePath[*]'],
      })
    }
  }
}
