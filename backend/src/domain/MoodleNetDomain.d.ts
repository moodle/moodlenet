import { AccountingService } from './services/accounting/AccountingService'
import { EmailService } from './services/email/EmailService'

export type MoodleNetDomain = {
  name: 'MoodleNetDomain'
  services: {
    Accounting: AccountingService
    Email: EmailService
  }
}
