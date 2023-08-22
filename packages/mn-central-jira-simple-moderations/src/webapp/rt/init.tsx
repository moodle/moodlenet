// registerMainAppPluginHook(() => useMemo<MainAppPluginHookResult>(() => ({ MainWrapper }), []))

// ResourcePagePlugins.register(function useResourcePagePlugin({ resourceCommonProps }) {
//   return useMemo(
//     () => ({
//       generalAction: {
//         sendToMoodle: resourceCommonProps
//           ? {
//               Item: SendToMoodleContainer,
//             }
//           : undefined,
//       },
//     }),
//     [resourceCommonProps],
//   )
// })
