export * from './types.mjs';
declare const connection: import("@moodlenet/core").PkgConnection<{
    apis: {
        getAppearance: import("@moodlenet/core").ApiDef<() => Promise<{
            data: any;
        }>>;
        setAppearance: import("@moodlenet/core").ApiDef<({ appearanceData }: {
            appearanceData: import("./types.mjs").AppearanceData;
        }) => Promise<{
            valid: boolean;
        }>>;
        plugin: import("@moodlenet/core").ApiDef<(pluginDef: import("./types.mjs").WebappPluginDef) => Promise<void>>;
    };
}>;
export default connection;
//# sourceMappingURL=main.d.mts.map