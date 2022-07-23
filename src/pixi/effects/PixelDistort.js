import Utils from "../core/Utils.js"
const def = Utils.def

class PixelDistort {
    constructor(shape, configProvider) {
        this.shape = shape
        this.enabled = false
        this.configProvider = configProvider

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
            let config = this.configProvider(pixel)
            pixel.distort = {
                radius: def(config.radius, 10),
                speed: def(config.speed, 0.01),
                smoothness: def(config.smoothness, 0.1),
                tick: def(config.tick, Math.random() * Math.PI * 2),
                ox: pixel.x,
                oy: pixel.y,
            }
        })
    }

    render(pixel) {
        let distort = pixel.distort
        if (!distort) { return }
        if (this.enabled) {
            let px = Math.sin(distort.tick) * distort.radius
            let py = Math.cos(distort.tick) * distort.radius
            pixel.x += (px - pixel.x) * distort.smoothness
            pixel.y += (py - pixel.y) * distort.smoothness
        } else {
            pixel.x += (pixel.distort.ox - pixel.x) * distort.smoothness
            pixel.y += (pixel.distort.oy - pixel.y) * distort.smoothness
        }
        distort.tick += distort.speed
    }
}

export default PixelDistort