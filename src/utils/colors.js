export function convertToRGBA(color, alpha) {
    let r, g, b;

    if (color.startsWith("#")) {
        // Convert hex to RGB
        if (color.length === 4) {
            r = parseInt(color[1] + color[1], 16);
            g = parseInt(color[2] + color[2], 16);
            b = parseInt(color[3] + color[3], 16);
        } else if (color.length === 7) {
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5, 7), 16);
        } else{
            if (color.length > 7) {
                r = parseInt(color.slice(1, 3), 16);
                g = parseInt(color.slice(3, 5), 16);
                b = parseInt(color.slice(5, 7), 16);
            }
        }
    } else if (color.startsWith("rgb")) {
        // Extract RGB values from "rgb(r, g, b)" or "rgba(r, g, b, a)"
        let parts = color.match(/\d+/g);
        r = parseInt(parts[0]);
        g = parseInt(parts[1]);
        b = parseInt(parts[2]);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}