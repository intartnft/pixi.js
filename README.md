# pixi.js
![pixi.js](https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif)
An interactive pixel art rendering engine for browsers

## Usage
Download the latest [minified library](https://raw.github.com/jonobr1/two.js/dev/build/two.min.js) and include it in your html.

```html
<script src="js/pixi.min.js"></script>
```

Here is boilerplate html in order to render a png in pixi.js:
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
cd ~/path-to-repo/pixi.js
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