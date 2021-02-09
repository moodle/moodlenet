import { Resolvers } from '../../../../UserAccount.graphql.gen'

export const userAccountTypeResolvers: Omit<Resolvers, 'Mutation'> = {
  Query: {} as any,
  SimpleResponse: {} as any,
  ActivationOutcome: {} as any,
  UserSession: {} as any,
  DateTime: {} as any,
  Empty: {} as any,
  Never: {} as any,
}
