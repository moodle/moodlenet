import { MoodleNet } from '../..'

export type AccountingRoutes = 'Register_New_Account' | 'Change_Account_Email'
export const accountingRoutes = MoodleNet.routes<AccountingRoutes>()
