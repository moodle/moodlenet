import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import { Adapter, AdapterPayload } from 'oidc-provider'
import { shell } from '../shell.mjs'

export const { db } = await shell.call(getMyDB)()

const GRANTABLE = new Set([
  'AccessToken',
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
  'BackchannelAuthenticationRequest',
])

// adapted from MongoAdapter: https://github.com/panva/node-oidc-provider/blob/433d131989558e24c0c74970d2d700af2199485d/example/adapters/mongodb.js
export class ArangoAdapter implements Adapter {
  constructor(public name: string) {}

  // NOTE: the payload for Session model may contain client_id as keys, make sure you do not use
  //   dots (".") in your client_id value charset.
  async upsert(
    _key: string,
    payload: AdapterPayload,
    expiresIn: number,
  ): Promise<void | undefined> {
    let expiresAt

    if (expiresIn) {
      expiresAt = new Date(Date.now() + expiresIn * 1000)
    }

    const coll = await this.coll()
    coll.save(
      { _key, payload, ...(expiresAt ? { expiresAt } : undefined) },
      {
        overwriteMode: 'update',
        silent: true,
        waitForSync: true,
      },
    )
  }

  async find(_key: string): Promise<void | AdapterPayload | undefined> {
    const ModelCollection = await this.coll()
    const record = await ModelCollection.document({ _key }, { graceful: true })
    if (!record) return undefined
    return record.payload
  }

  async findByUserCode(userCode: string): Promise<void | AdapterPayload | undefined> {
    const ModelCollection = await this.coll()
    const cursor = await db.query(
      `
    FOR record in @@ModelCollection
      FILTER record.payload.userCode == @userCode
      LIMIT 1
    RETURN record
  `,
      { userCode, '@ModelCollection': ModelCollection.name },
    )

    const record = await cursor.next()
    if (!record) return undefined
    return record.payload
  }

  async findByUid(uid: string): Promise<void | AdapterPayload | undefined> {
    const ModelCollection = await this.coll()
    const cursor = await db.query(
      `
    FOR record in @@ModelCollection
      FILTER record.payload.uid == @uid
      LIMIT 1
    RETURN record
  `,
      { uid, '@ModelCollection': ModelCollection.name },
    )

    const record = await cursor.next()
    if (!record) return undefined
    return record.payload
  }

  async destroy(_key: string): Promise<void | undefined> {
    const ModelCollection = await this.coll()
    await ModelCollection.remove({ _key })
  }

  async revokeByGrantId(grantId: string): Promise<void | undefined> {
    const ModelCollection = await this.coll()
    await db.query(
      `
    FOR record in @@ModelCollection
      FILTER record.payload.grantId == @grantId
      REMOVE record IN @@ModelCollection
    RETURN record._key
  `,
      { grantId, '@ModelCollection': ModelCollection.name },
      //  {count:true}
    )
  }

  async consume(_key: string): Promise<void | undefined> {
    const ModelCollection = await this.coll()
    await ModelCollection.update(
      { _key },
      {
        payload: {
          consumed: Math.floor(Date.now() / 1000),
        },
      },
      { silent: true, waitForSync: true },
    )
  }

  coll(name = this.name) {
    return ArangoAdapter.coll(name)
  }

  static async coll(name: string) {
    const { collection, newlyCreated } = await shell.call(ensureDocumentCollection)(
      `Adapter_${name}`,
    )
    const indexePromises: Promise<any>[] = []
    if (newlyCreated) {
      indexePromises.push(
        collection.ensureIndex({
          name: 'expire',
          type: 'ttl',
          fields: ['expiresAt'],
          expireAfter: 0,
        }),
      )
      if (GRANTABLE.has(name)) {
        indexePromises.push(
          collection.ensureIndex({
            name: 'grantId',
            fields: ['payload.grantId'],
            type: 'persistent',
          }),
        )
      }
      if (name === 'DeviceCode') {
        indexePromises.push(
          collection.ensureIndex({
            name: 'userCode',
            type: 'persistent',
            fields: ['payload.userCode'],
            unique: true,
          }),
        )
      }
      if (name === 'Session') {
        indexePromises.push(
          collection.ensureIndex({
            name: 'uid',
            type: 'persistent',
            fields: ['payload.uid'],
            unique: true,
          }),
        )
      }
    }
    return collection
  }
}
