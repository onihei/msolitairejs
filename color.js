
export default class Color {

    static rgb(red, green, blue) {
        return `rgb(${red},${green},${blue})`;
    }

    static rgba(red, green, blue, alpha) {
        return `rgba(${red},${green},${blue},${alpha})`;
    }

    static hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}
