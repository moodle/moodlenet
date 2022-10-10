import type { ResolveOptions } from 'webpack';
import webpack from 'webpack';
export default startProdWp;
export declare type ExtensionsBag = {
    extensionsDirectoryModule: string;
    webpackAliases: Record<string, string>;
};
export declare function startProdWp({ buildFolder, latestBuildFolder, baseResolveAlias, }: {
    baseResolveAlias: ResolveOptions['alias'];
    latestBuildFolder: string;
    buildFolder: string;
}): {
    compiler: webpack.Compiler;
};
export declare function getWp(cfg: {
    mode: 'prod';
    buildFolder: string;
    baseResolveAlias: ResolveOptions['alias'];
} | {
    baseResolveAlias: ResolveOptions['alias'];
    mode: 'dev-server';
    port: number;
    proxy: string;
}): webpack.Compiler;
//# sourceMappingURL=webpackWatch.d.mts.map