import { Domain } from '../DomainTypes'

export type TestEvents = {
  testEvent: { tst: number }
}

export type SendTestReq = {
  amount: number
  to: number
  errorAt: number
}

export type SendTestOutcome = TestSentResult | SendTestError
export type TestSentResult = {
  rnd: number
  sign: string
}
export type SendTestError = {
  error: string
  sign: string
}

export type TestApis = {
  testApi: [SendTestReq, SendTestOutcome]
}

export type TestDomain = Domain<'Test', TestEvents, TestApis>
