import env from './mongo.env'
import { MongoClient } from 'mongodb'
import { EmailPersistenceImpl, StoreSentEmailData, StoreSentVerifyEmailData } from '../../../types'

const client = new MongoClient(`mongodb://${env.mongoUrl}`).connect()
const sentEmailCollection = client.then((cli) => cli.db().collection<StoreSentEmailData>('sent'))
const veifyEmailCollection = client.then((cli) =>
  cli.db().collection<StoreSentVerifyEmailData>('verify')
)

const mongoImpl: EmailPersistenceImpl = {
  async storeSentEmail(data) {
    const res = await (await sentEmailCollection).insertOne(data)
    return res.insertedId.toHexString()
  },

  async storeSentVerifyEmail(data) {
    const res = await (await veifyEmailCollection).insertOne(data)
    return res.insertedId.toHexString()
  },

  async checkVerifyEmail(data) {
    const res = await (await veifyEmailCollection).updateOne(
      { email: data.email, token: data.token, verifiedAt: null },
      {
        $currentDate: {
          verifiedAt: true,
        },
      }
    )
    return res.modifiedCount === 1
  },
  async deleteVerifyingEmail(data) {
    const res = await (await veifyEmailCollection).deleteOne({
      email: data.email,
      token: data.token,
      verifiedAt: null,
    })
    return res.deletedCount === 1
  },
}

module.exports = mongoImpl
export default mongoImpl
