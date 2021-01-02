import { Resolvers } from '../../../../UserAccount.graphql.gen';

export const userAccountTypeResolvers: Omit<Resolvers, 'Mutation'> = {
  Query: {} as any,
  RequestConfirmEmailResponse: {} as any,
  Session: {} as any,
  SimpleResponse: {} as any,
}
