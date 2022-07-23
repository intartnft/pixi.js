import Utils from "./Utils.js"
const def = Utils.def

class Scene {
    constructor(config) {
        this.shapes = []
        this.canvas = config.canvas;
        this.ctx = config.canvas.getContext('2d');
        this.scenePixelSize = def(config.scenePixelSize, { width: 50, height: 50 })
        this.pixelSize = def(config.pixelSize, 10)
        this.sceneOffset = def(config.sceneOffset, { x: 0, y: 0 })
        this.pointer = def(config.pointer, { x: 0, y: 0 })
        this.isStatic = def(config.isStatic, false)
        this.backgroundColor = def(config.backgroundColor, "#ffffff")
        this.minPixelSize = def(config.minPixelSize, 2)
    }

    addShape(shape) {
        this.shapes.push(shape)
    }

    addShapes(shapes) {
        shapes.forEach(shape => {
            this.shapes.push(shape)
        })
    }

    centerShape(shape) {
        shape.x = Math.floor(this.scenePixelSize.width * 0.5)
        shape.y = Math.floor(this.scenePixelSize.height * 0.5)
    }

    centerShapes(shapes) {
        shapes.forEach(shape => {
            shape.x = Math.floor(this.scenePixelSize.width * 0.5)
            shape.y = Math.floor(this.scenePixelSize.height * 0.5)
        })
    }

    render() {
        this.clear()
        this.shapes.forEach(shape => {
            if (shape.image) {
                this.drawImage(shape)
            } else if (shape.pixels) {
                this.drawPixels(shape)
            }
        });
    }

    clear() {
        this.ctx.fillStyle = this.backgroundColor
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    fitInSize(size) {
        if (size.width > size.height) {
            this.pixelSize = Math.round(size.height / this.scenePixelSize.height)
        } else {
            this.pixelSize = Math.round(size.width / this.scenePixelSize.width)
        }
        this.pixelSize = Math.max(this.pixelSize, this.minPixelSize)
        this.sceneOffset.x = (size.width - (this.pixelSize * this.scenePixelSize.width)) * 0.5
        this.sceneOffset.y = (size.height - this.pixelSize * this.scenePixelSize.height) * 0.5
    }

    drawPixels(shape) {
        if (!shape.visible) { return }
        shape.pixels.forEach(pixel => {
            shape.effects.forEach(effect => {
                effect.render(pixel)
            })
            let offsetX = 0
            let offsetY = 0
            if (!this.isStatic) {
                let px = ((this.pointer.x / this.canvas.width) - 0.5) * 2
                let py = ((this.pointer.y / this.canvas.height) - 0.5) * 2
                offsetX = px * shape.pointerOffset
                offsetY = py * shape.pointerOffset
            }
            this.ctx.globalCompositeOperation = shape.blendMode
            this.ctx.fillStyle = pixel.color.format()
            this.ctx.globalAlpha = shape.opacity
            let px = this.sceneOffset.x + (pixel.x + shape.x + offsetX) * this.pixelSize
            let py = this.sceneOffset.y + (pixel.y + shape.y + offsetY) * this.pixelSize
            px = Math.round(px / this.pixelSize) * this.pixelSize
            py = Math.round(py / this.pixelSize) * this.pixelSize
            this.ctx.fillRect(px, py, this.pixelSize, this.pixelSize)
            this.ctx.globalAlpha = 1
        })
    }

    drawImage(shape) {
        if (!shape.visible) { return }
        if (!shape.image) { return }
        let image = shape.image
        this.ctx.imageSmoothingEnabled = false
        let offsetX = 0
        let offsetY = 0
        if (!this.isStatic) {
            let px = ((this.pointer.x / this.canvas.width) - 0.5) * 2
            let py = ((this.pointer.y / this.canvas.height) - 0.5) * 2
            offsetX = px * shape.pointerOffset
            offsetY = py * shape.pointerOffset
        }
        this.ctx.globalCompositeOperation = shape.blendMode
        this.ctx.globalAlpha = shape.opacity
        let px = this.sceneOffset.x + (shape.x + offsetX) * this.pixelSize - (image.width * this.pixelSize) * 0.5
        let py = this.sceneOffset.y + (shape.y + offsetY) * this.pixelSize - (image.height * this.pixelSize) * 0.5
        px = Math.round(px / this.pixelSize) * this.pixelSize
        py = Math.round(py / this.pixelSize) * this.pixelSize
        this.ctx.drawImage(image, 0, 0, image.width, image.height, px, py, image.width * this.pixelSize, image.height * this.pixelSize);
    }
}

export default Scene