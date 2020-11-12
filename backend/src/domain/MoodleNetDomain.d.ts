import { AccountingService } from './services/accounting/AccountingService'
import { EmailService } from './services/email/EmailService'

export type MoodleNetDomain = {
  name: 'MoodleNet'
  services: {
    Accounting: AccountingService
    Email: EmailService
  }
}
