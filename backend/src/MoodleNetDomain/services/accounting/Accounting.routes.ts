import { MoodleNet } from '../..'

export type AccountingRoutes =
  | 'Register_New_Account'
  | 'Change_Account_Email'
  | 'Temp_Email_Session'
  | 'accounting-graphql-request'
export const accountingRoutes = MoodleNet.routes<AccountingRoutes>()
