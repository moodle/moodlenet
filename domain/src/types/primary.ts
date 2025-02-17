/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
// import '@moodle/lib-types'

// declare global {
//   namespace moo {
//     type Primary = {
//       [personaType in personaType]: Primary_Personas<Personas[personaType]>
//     }

//     type Primary_Personas<persona extends DefPersona> = {
//       [contextName in keyof persona]: persona[contextName] extends DefContext ? Primary_Context<persona[contextName]> : never
//     }

//     type Primary_Context<context extends DefContext> = {
//       [scopeName in keyof context]: context[scopeName] extends DefScope ? Primary_Scope<context[scopeName]> : never
//     }

//     type Primary_Scope<scope extends DefScope> = {
//       [useCaseName in keyof scope]: scope[useCaseName] extends DefUseCase ? Primary_UseCase<scope[useCaseName]> : never
//     }

//     type Primary_UseCase<useCase extends DefUseCase> = {
//       [endpointName in keyof useCase]: useCase[endpointName] extends EndpointDef
//         ? Primary_UseCaseEndpoint<useCase[endpointName]>
//         : never
//     }

//     type Primary_UseCaseEndpoint<useCaseEndpoint extends EndpointDef> = (
//       message: useCaseEndpoint[0],
//     ) => Promise<useCaseEndpoint[1]>
//   }
// }
