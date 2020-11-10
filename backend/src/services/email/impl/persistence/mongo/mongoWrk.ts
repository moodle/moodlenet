import env from './mongo.env'
import { MongoClient } from 'mongodb'
import { EmailPersistenceImpl, StoreSentEmailData } from '../../../types'

const client = new MongoClient(`mongodb://${env.mongoUrl}`).connect()
const sentEmailCollection = client.then((cli) => cli.db().collection<StoreSentEmailData>('sent'))

const mongoImpl: EmailPersistenceImpl = {
  async storeSentEmail(data) {
    const res = await (await sentEmailCollection).insertOne(data)
    return res.insertedId.toHexString()
  },
}

module.exports = mongoImpl
export default mongoImpl
