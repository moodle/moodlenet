import { Flow } from '../../../../lib/domain/flow'
import { SendResult } from '../Email'
import { EmailObj } from '../types'

interface EmailPersistence {
  storeSentEmail(_: { email: EmailObj; flow: Flow; result: SendResult }): Promise<any>
}
