# pixi.js
![pixi.js](https://github.com/thedudesnft/pixi.js/blob/main/assets/pixi.gif?raw=true)
#### An interactive pixel art rendering engine for browsers

## Usage
Download the latest [minified library](https://github.com/thedudesnft/pixi.js/blob/main/build/pixi.min.js) and include it in your html.

Here is boilerplate html in order to render a png in pixi.js. First include the latest pixi.js:
```html
<script src="js/pixi.min.js"></script>
```

Create your scene, shape and then add shape to your scene then render. That's it!. For more, please check the [examples](https://github.com/thedudesnft/pixi.js/tree/main/examples).
```html
<body>
    <canvas id="canvas"></canvas>
    <script>
        const canvas = document.getElementById("canvas")

        const scene = new Pixi.Scene({
            canvas: canvas,
            backgroundColor: "#ffffff",
            scenePixelSize: { width: 65, height: 65 },
            isStatic: true,
        })

        const shape = new Pixi.Shape({
            image: "./shape.png",
            pointerOffset: 1,
            pixelated: true,
        })
        scene.addShape(shape)

        function resize() {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            scene.fitInSize({ width: canvas.width, height: canvas.height })
        }

        function render() {
            window.requestAnimationFrame(render);
            resize()
            scene.centerShape(shape)
            scene.render()
        }

        window.addEventListener("mousemove", event => {
            scene.pointer = { x: event.clientX, y: event.clientY }
        })

        render()
    </script>
</body>
```

## Custom Build
pixi.js uses [nodejs](http://nodejs.org/) in order to build source files. You'll first want to install that. Once installed open up a terminal and head to the repository folder:

```
cd ~/path-to-repo
npm install
```

Then run:
```
npm run build
```

This will generate development and production builds under the build folder.

## Running Examples
pixi.js comes with its own static server. This allows you to run the examples on your localhost. After installing the package dependencies run:
Then run:

```
npm run start
```

This command will open layers example on your default browser.