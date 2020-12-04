import { MoodleNet } from '../..'

export const accountingRoutes = MoodleNet.routes<'Register_New_Account_Email_Confirmation'>()

accountingRoutes.bind({
  event: 'Email.Verify_Email.Result',
  api: 'Accounting.Register_New_Account.Email_Confirm_Result',
  route: 'Register_New_Account_Email_Confirmation',
})
