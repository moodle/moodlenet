export declare const adjustColor: (color: string, amount: number) => string;
export declare const setOpacity: (color: string, opacity: number) => string;
export declare const randomColor: () => string;
declare type RgbType = {
    r: number;
    g: number;
    b: number;
};
export declare const hexToRgb: (hex: string) => RgbType;
export declare const rgbToHex: (rgb: RgbType) => string;
export declare const rgbToHsl: (rgbColor: RgbType) => HslType;
declare type HslType = {
    h: number;
    s: number;
    l: number;
};
export declare const hslForCss: (hsl: HslType) => string;
export declare const hexToHsl: (hex: string) => HslType;
export declare const hslToHex: (hsl: HslType) => string;
export declare const changeHue: (hsl: HslType, i: number) => HslType;
export declare const changeSaturation: (hsl: HslType, i: number) => HslType;
export declare const changeLightness: (hsl: HslType, i: number) => HslType;
export declare const darken: (hsl: HslType, i: number) => HslType;
export declare const lighten: (hsl: HslType, i: number) => HslType;
export declare const saturate: (hsl: HslType, i: number) => HslType;
export declare const desaturate: (hsl: HslType, i: number) => HslType;
export declare const balanceColor: (hex: string) => HslType;
export declare const getGrayScale: (color: HslType) => any;
export declare const getColorPalette: (hex: string) => any;
export {};
//# sourceMappingURL=utilities.d.ts.map