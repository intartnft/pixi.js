const canvas = document.getElementById("canvas")

const scene = new Pixi.Scene({
    canvas: canvas,
    backgroundColor: "#ffffff",
    scenePixelSize: { width: 65, height: 65 }
})

const logoText = new Pixi.Shape({
    image: "./assets/logo_text.png",
    pointerOffset: 2,
    pixelated: true,
})

const logoBorder = new Pixi.Shape({
    image: "./assets/logo_border.png",
    pointerOffset: 2,
    pixelated: true,
})

const logoShadow = new Pixi.Shape({
    image: "./assets/logo_shadow.png",
    pointerOffset: 1,
    pixelated: true,
})

const logoShape = [logoShadow, logoBorder, logoText]
scene.addShapes(logoShape)

const distortEffects = logoShape.map(shape => {
    const distort = new Pixi.PixelDistort(shape, (pixel) => {
        return {
            radius: Math.random() * 30,
            speed: Math.random() * 0.008,
            smoothness: 0.05
        }
    })
    shape.addEffect(distort)
    return distort
})

function distort(enabled) {
    distortEffects.forEach(distort => {
        distort.enabled = enabled
    })
}

function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    scene.fitInSize({ width: canvas.width, height: canvas.height })
}

function render() {
    window.requestAnimationFrame(render);
    resize()
    scene.centerShape(logoShape)
    scene.render()
}

window.addEventListener("mousemove", event => {
    scene.pointer = { x: event.clientX, y: event.clientY }
})

window.addEventListener("mousedown", event => {
    distort(true)
})

window.addEventListener("mouseup", event => {
    distort(false)
})

render()