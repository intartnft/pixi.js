class Color {
    constructor() {
        this.r = 0
        this.g = 0
        this.b = 0
        this.a = 0
    }

    static fromHex(hex) {
        let color = new Color()
        let rgba = hexToRgbA(hex)
        color.r = rgba[0]
        color.g = rgba[1]
        color.b = rgba[2]
        color.a = 1
        return color
    }

    static fromRGBA(r, g, b, a) {
        let color = new Color()
        color.r = r
        color.g = g
        color.b = b
        color.a = a
        return color
    }

    format() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")"
    }

    clone() {
        return Color.fromRGBA(this.r, this.g, this.b, this.a)
    }
}

const hexToRgbA = (hex) => {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return [(c >> 16) & 255, (c >> 8) & 255, c & 255]
    }
    throw new Error('Bad Hex');
}

export default Color