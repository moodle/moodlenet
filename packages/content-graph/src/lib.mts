import {
  ensureDocumentCollection,
  InvertedIndexPrimarySortFieldOptions,
  SearchAliasViewPatchIndexOptions,
} from '@moodlenet/arangodb/server'
import { getCurrentClientSession } from '@moodlenet/authentication-manager/server'
import assert from 'assert'
// import { getCurrentClientSession, UserId } from '@moodlenet/authentication-manager/server'
import type { PkgIdentifier } from '@moodlenet/core'
import { EntitiesView } from './init.mjs'
import { shell } from './shell.mjs'
import {
  EntityCollectionDef,
  EntityCollectionDefOpts,
  EntityCollectionDefs,
  EntityCollectionHandle,
  EntityCollectionHandles,
  EntityData,
} from './types.mjs'

export function getEntityCollectionName(pkgId: PkgIdentifier, entityName: string) {
  return `${getPkgNamespace(pkgId)}__${entityName}`
}

export function getPkgNamespace(pkgId: PkgIdentifier) {
  return `${pkgId.name.replace(/^@/, '').replace('/', '__')}`
}

export async function registerEntities<Defs extends EntityCollectionDefs>(entities: {
  [name in keyof Defs]: EntityCollectionDefOpts
}): Promise<EntityCollectionHandles<Defs>> {
  const handles = await Object.keys(entities).reduce(async (_acc, entityName) => {
    const defOpt = entities[entityName]
    assert(defOpt)
    return {
      ...(await _acc),
      [entityName]: await registerEntity(entityName, defOpt),
    }
  }, Promise.resolve({} as EntityCollectionHandles<Defs>))
  return handles
}

const DEFAULT_TITLE_DESCRIPTION_INDEX_NAME = 'default_title_description'
const DEFAULT_TITLE_DESCRIPTION_INDEX_FIELDS = ['title', 'description']
export async function registerEntity<DataType extends Record<string, any>>(
  entityName: string,
  defOpt?: EntityCollectionDefOpts,
): Promise<EntityCollectionHandle<EntityCollectionDef<DataType>>> {
  type Def = EntityCollectionDef<DataType>
  const { pkgId } = shell.assertCallInitiator()
  const entityCollectionName = getEntityCollectionName(pkgId, entityName)
  const { collection, newlyCreated } = await shell.call(ensureDocumentCollection)<
    EntityData<DataType>
  >(entityCollectionName)
  //const currentProperties = await EntitiesView.updateProperties<SearchAliasViewPropertiesOptions>()
  const userKey = (await getCurrentClientSession())?.user?._key
  newlyCreated &&
    (await collection.ensureIndex({
      name: DEFAULT_TITLE_DESCRIPTION_INDEX_NAME,
      type: 'inverted',
      primarySort: {
        fields: DEFAULT_TITLE_DESCRIPTION_INDEX_FIELDS.map<InvertedIndexPrimarySortFieldOptions>(
          field => ({ direction: 'asc', field }),
        ),
      },
      storedValues: [{ fields: DEFAULT_TITLE_DESCRIPTION_INDEX_FIELDS }],
      fields: DEFAULT_TITLE_DESCRIPTION_INDEX_FIELDS,
      inBackground: true,
    }))

  const defaultIndexesIfNewlyCreated: Required<EntityCollectionDefOpts>['updateAdditionaIndexes'] =
    newlyCreated ? [{ index: DEFAULT_TITLE_DESCRIPTION_INDEX_NAME, operation: 'add' }] : []

  const updateIndexes = [
    ...defaultIndexesIfNewlyCreated,
    ...(defOpt?.updateAdditionaIndexes ?? []),
  ].map<SearchAliasViewPatchIndexOptions>(({ index, operation }) => ({
    collection: collection.name,
    index,
    operation,
  }))

  if (updateIndexes.length) {
    await EntitiesView.updateProperties({
      // indexes: [],
      // indexes:[...currentProperties.indexes, ...addIndexes],
      indexes: updateIndexes, //[...currentProperties.indexes, ...addIndexes],
    })
  }

  const create: EntityCollectionHandle<Def>['create'] = async (
    newEntityData,
    newEntitySearchData,
  ) => {
    const now = new Date().toISOString()

    const { new: newEntity } = await collection.save(
      {
        ...newEntityData,
        _meta: {
          searchData: newEntitySearchData,
          creator: userKey ? { userKey } : undefined,
          updated: now,
          created: now,
          entityClass: { pkgName: pkgId.name, type: entityName },
        },
      },
      { returnNew: true },
    )
    assert(newEntity)
    return newEntity
  }

  const update: EntityCollectionHandle<Def>['update'] = async (
    sel,
    patchEntityData,
    patchSearchData,
  ) => {
    const updateResponse = await collection.update(
      sel,
      {
        ...patchEntityData,
        _meta: {
          updated: new Date().toISOString(),
          searchData: patchSearchData,
        },
      },
      { returnNew: true, returnOld: true },
    )
    if (!updateResponse) {
      return null
    }
    const { new: newEntityData, old: oldEntityData } = updateResponse
    assert(newEntityData && oldEntityData)
    return { new: newEntityData, old: oldEntityData }
  }

  const remove: EntityCollectionHandle<Def>['remove'] = async sel => {
    const { old } = await collection.remove(sel, { returnOld: true })
    if (!old) {
      return null
    }
    return old
  }
  const get: EntityCollectionHandle<Def>['get'] = async sel => {
    const entity = await collection.document(sel, true)
    if (!entity) {
      return null
    }
    return entity
  }

  return {
    collection,
    create,
    update,
    get,
    remove,
  }
}
