export const fileExceedsMaxUploadSize = (size, max) => max === null ? false : size > max;
export const randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};
//# sourceMappingURL=utilities.js.map