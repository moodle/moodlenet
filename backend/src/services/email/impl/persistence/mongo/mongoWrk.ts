import env from './mongo.env'
import { MongoClient } from 'mongodb'
import { EmailPersistenceImpl, StoreSentEmailData, StoreSentVerifyEmailData } from '../../../types'

const db = await (await new MongoClient(env.mongoUrl)).db()
const sentEmailCollection = db.collection<StoreSentEmailData>('sent')
const veifyEmailCollection = db.collection<StoreSentVerifyEmailData>('verify')

const mongoImpl: EmailPersistenceImpl = {
  async storeSentEmail(data) {
    const res = await sentEmailCollection.insertOne(data)
    return res.insertedId.toHexString()
  },

  async storeSentVerifyEmail(data) {
    const res = await veifyEmailCollection.insertOne(data)
    return res.insertedId.toHexString()
  },

  async checkVerifyEmail(data) {
    const res = await veifyEmailCollection.updateOne(
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
    const res = await veifyEmailCollection.deleteOne({
      email: data.email,
      token: data.token,
      verifiedAt: null,
    })
    return res.deletedCount === 1
  },
}

module.exports = mongoImpl
