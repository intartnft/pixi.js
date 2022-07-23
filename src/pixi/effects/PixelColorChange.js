import Utils from "../core/Utils.js"
const def = Utils.def

class PixelColorChange {
    constructor(shape, config) {
        this.shape = shape
        this.smoothness = def(config.smoothness, 0.1)

        if (shape.isReady) {
            this.configure(shape)
        } else {
            shape.events.addListener("shapeIsReady", this, (shape) => {
                this.configure(shape)
            })
        }
    }

    configure(shape) {
        shape.pixels.forEach(pixel => {
            pixel.colorChange = {
                originalColor: pixel.color.clone(),
                targetColor: pixel.color.clone()
            }
        })
    }

    render(pixel) {
        if (!pixel.colorChange) { return }
        let targetColor = pixel.colorChange.targetColor
        pixel.color.r += Math.floor((targetColor.r - pixel.color.r) * this.smoothness)
        pixel.color.g += Math.floor((targetColor.g - pixel.color.g) * this.smoothness)
        pixel.color.b += Math.floor((targetColor.b - pixel.color.b) * this.smoothness)
        pixel.color.a += Math.floor((targetColor.a - pixel.color.a) * this.smoothness)
    }
}

export default PixelColorChange