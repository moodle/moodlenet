export type messageDispatcher<more = unknown> = (message: { path: string[]; payload: unknown } & more) => Promise<unknown>
