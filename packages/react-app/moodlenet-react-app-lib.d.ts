/// <reference types="react-scripts/lib/react-app" />
/// <reference path="./src/react-app-lib/index.ts" />

declare module 'moodlenet-react-app-lib' {
  const lib: MoodlenetLib
  export default lib
}

declare module 'ext-routes' {
  const routes: ExtRoute[]
  export default routes
}

declare module 'ext-context-providers-modules' {
  const ctxProviders: Record<string, ExtContextProvider>
  export default ctxProviders
}

declare module 'pkgs-main-modules' {
  const exp: Record<string, ExtExpose>
  export default exp
}
