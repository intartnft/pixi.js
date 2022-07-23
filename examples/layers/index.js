const canvas = document.getElementById("canvas")

const scene = new Pixi.Scene({
    canvas: canvas,
    backgroundColor: "#ffffff",
    scenePixelSize: { width: 65, height: 65 },
})

const layer1Shape = new Pixi.Shape({
    image: "./assets/layer1.png",
    pointerOffset: 1,
})

const layer2Shape = new Pixi.Shape({
    image: "./assets/layer2.png",
    pointerOffset: 3,
})

const layer3Shape = new Pixi.Shape({
    image: "./assets/layer3.png",
    pointerOffset: 6,
})

layer1Shape.opacity = 1
layer2Shape.opacity = 0.9
layer3Shape.opacity = 0.8

const object = [layer1Shape, layer2Shape, layer3Shape]
scene.addShapes(object)

function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    scene.fitInSize({ width: canvas.width, height: canvas.height })
}

function render() {
    window.requestAnimationFrame(render);
    resize()
    scene.centerShapes(object)
    scene.render()
}

window.addEventListener("mousemove", event => {
    scene.pointer = { x: event.clientX, y: event.clientY }
})

render()