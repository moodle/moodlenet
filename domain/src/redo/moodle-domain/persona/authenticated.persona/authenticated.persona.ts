export type authenticated = moo.persona<{
  [moo.persona.directives]: { userId: string }
}>
