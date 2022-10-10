import { CSSProperties } from 'react';
import { BaseStyleType } from './config.js';
export declare type StyleContextType = {
    style: BaseStyleType & CSSProperties;
    setStyle: (style: BaseStyleType & CSSProperties) => unknown;
};
declare const StyleContext: import("react").Context<StyleContextType>;
export declare const StyleProvider: import("react").Provider<StyleContextType>;
export default StyleContext;
//# sourceMappingURL=Style.d.ts.map