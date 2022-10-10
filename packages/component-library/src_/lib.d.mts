import { PackageInfo } from '@moodlenet/core';
import { AppearanceData, WebappPluginDef } from './types.mjs';
export declare function setAppearance({ appearanceData }: {
    appearanceData: AppearanceData;
}): Promise<{
    valid: boolean;
}>;
export declare function getAppearance(): Promise<{
    data: any;
}>;
export declare function setupPlugin({ pkgInfo, pluginDef }: {
    pluginDef: WebappPluginDef;
    pkgInfo: PackageInfo;
}): Promise<void>;
//# sourceMappingURL=lib.d.mts.map