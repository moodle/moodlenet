import * as GQL from '../global.graphql.gen'

export const access: GQL.DirectiveResolvers['access'] = async (
  _next, //: NextResolverFn<TResult>,
  parent, //: TParent,
  args, //: TArgs,
  context, //: TContext,
  _info //: GraphQLResolveInfo
) => {
  console.log({
    scope: '*********************************************** accessDirective',
    parent,
    args,
    context,
  })
  const res = await _next()
  console.log({
    scope: '*********************************************** accessDirective',
    res,
  })
}
