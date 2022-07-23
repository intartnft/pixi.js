import Events from "./Events.js"
import Color from "./Color.js"

class Shape {
    constructor(object) {
        this.visible = true
        this.opacity = 1
        this.blendMode = ""
        this.pixels = []
        this.effects = []
        this.isReady = false
        this.events = new Events()
        if (object) {
            this.parse(object)
        }
    }

    addEffect(effect) {
        this.effects.push(effect)
    }

    addEffects(effects) {
        effects.forEach(effect => {
            this.effects.push(effect)
        })
    }

    parse(object) {
        if (object.pixels) {
            this.parseWithPixels(object)
        } else if (object.image) {
            this.parseWithImage(object)
        }
    }

    parseWithPixels(object) {
        this.rawObject = object
        let boundry = { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } }
        object.pixels.forEach(pixel => {
            boundry.max.x = Math.max(boundry.max.x, pixel.x)
            boundry.max.y = Math.max(boundry.max.y, pixel.y)
            boundry.min.x = Math.min(boundry.min.x, pixel.x)
            boundry.min.y = Math.min(boundry.min.y, pixel.y)
        })
        let center = {
            x: Math.floor((boundry.max.x - boundry.min.x) * 0.5),
            y: Math.floor((boundry.max.y - boundry.min.y) * 0.5),
        }
        let pixels = []
        object.pixels.forEach(pixelData => {
            let px = pixelData.x - center.x
            let py = pixelData.y - center.y
            let color
            if (pixelData.color instanceof Color) {
                color = pixelData.color
            } else {
                color = Color.fromHex(pixelData.color)
            }
            if (object.ignoreTransparentPixels && color.a == 0) {
                return
            }
            let pixel = {
                x: px,
                y: py,
                color: color
            }
            pixels.push(pixel)
        })

        this.boundry = boundry
        this.pixels = pixels
        this.pointerOffset = object.pointerOffset
        this.x = center.x
        this.y = center.y
        this.isReady = true
        this.events.fire("shapeIsReady", this)
    }

    parseWithImage(object) {
        loadImage(object.image, (image) => {
            if (object.pixelated) {
                object.pixels = parseImagePixels(
                    image
                )
                this.parseWithPixels(object)
                return
            }
            this.image = image
            this.boundry = { min: { x: 0, y: 0 }, max: { x: image.width, y: image.height } }
            this.pointerOffset = object.pointerOffset
            this.x = 0
            this.y = 0
            this.isReady = true
            this.events.fire("shapeIsReady", this)
        })
    }
}

let parseImagePixels = (image) => {
    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext("2d")
    ctx.drawImage(image, 0, 0)
    let width = image.width
    let height = image.height
    let imageData = ctx.getImageData(0, 0, width, height)
    let rgba = imageData.data
    let pixels = []
    for (var i = 0; i < width; i += 1) {
        for (var j = 0; j < height; j += 1) {
            let p = (j * width + i) * 4
            let r = rgba[p]
            let g = rgba[p + 1]
            let b = rgba[p + 2]
            let a = rgba[p + 3]
            pixels.push({
                x: i,
                y: j,
                color: Color.fromRGBA(r, g, b, a)
            })
        }
    }
    return pixels
}

let loadImage = (src, completion) => {
    let image = new Image()
    image.onload = () => {
        completion(image)
    }
    image.src = src
}

export default Shape