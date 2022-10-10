import assert from 'assert';
import { addWebappPluginItem } from './init.mjs';
import { kvStore } from './use-pkg-apis.mjs';
export async function setAppearance({ appearanceData }) {
    const data = await kvStore.set('appearanceData', '', appearanceData);
    return { valid: !data || !data.value ? false : true };
}
export async function getAppearance() {
    const data = await kvStore.get('appearanceData', '');
    assert(data.value, 'Appearance should be valued');
    return { data: data.value };
}
export async function setupPlugin({ pkgInfo, pluginDef }) {
    const webappPluginItem = {
        ...pluginDef,
        guestPkgInfo: pkgInfo,
    };
    addWebappPluginItem(webappPluginItem);
}
//# sourceMappingURL=lib.mjs.map