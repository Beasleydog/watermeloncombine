function hexToRgb(hex) {
    const hexValue = hex.replace('#', '');
    const r = parseInt(hexValue.substring(0, 2), 16);
    const g = parseInt(hexValue.substring(2, 4), 16);
    const b = parseInt(hexValue.substring(4, 6), 16);
    let a = parseInt(hexValue.substring(6, 8), 16) / 255;
    if (isNaN(a)) a = 1;
    return { r, g, b, a };
}
export default hexToRgb;