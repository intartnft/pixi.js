var Pixi;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/pixi/core/Color.js":
/*!********************************!*\
  !*** ./src/pixi/core/Color.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Color);

/***/ }),

/***/ "./src/pixi/core/Events.js":
/*!*********************************!*\
  !*** ./src/pixi/core/Events.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const events = {}

class Events {
    addListener(event, listener, block) {
        if (events[event]) {
            events[event].push({block, listener})
        }else{
            events[event] = [{block, listener}]
        }
    }

    removeListener(listener) {
        events = events.filter(event => {
            return event.listener != listener
        })
    }

    fire(event, data) {
        if (events[event]) {
            events[event].forEach(event => {
                event.block(data)
            });
        }
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Events);

/***/ }),

/***/ "./src/pixi/core/Scene.js":
/*!********************************!*\
  !*** ./src/pixi/core/Scene.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils.js */ "./src/pixi/core/Utils.js");

const def = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].def

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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Scene);

/***/ }),

/***/ "./src/pixi/core/Shape.js":
/*!********************************!*\
  !*** ./src/pixi/core/Shape.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Events_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Events.js */ "./src/pixi/core/Events.js");
/* harmony import */ var _Color_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Color.js */ "./src/pixi/core/Color.js");



class Shape {
    constructor(object) {
        this.visible = true
        this.opacity = 1
        this.blendMode = ""
        this.pixels = []
        this.effects = []
        this.isReady = false
        this.events = new _Events_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
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
            if (pixelData.color instanceof _Color_js__WEBPACK_IMPORTED_MODULE_1__["default"]) {
                color = pixelData.color
            } else {
                color = _Color_js__WEBPACK_IMPORTED_MODULE_1__["default"].fromHex(pixelData.color)
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
                color: _Color_js__WEBPACK_IMPORTED_MODULE_1__["default"].fromRGBA(r, g, b, a)
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Shape);

/***/ }),

/***/ "./src/pixi/core/Utils.js":
/*!********************************!*\
  !*** ./src/pixi/core/Utils.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let def = (configItem, defaultValue) => {
    if (configItem) {
        return configItem
    }
    return defaultValue
}

const Utils = {def}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Utils);

/***/ }),

/***/ "./src/pixi/effects/PixelColorChange.js":
/*!**********************************************!*\
  !*** ./src/pixi/effects/PixelColorChange.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Utils.js */ "./src/pixi/core/Utils.js");

const def = _core_Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].def

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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PixelColorChange);

/***/ }),

/***/ "./src/pixi/effects/PixelDistort.js":
/*!******************************************!*\
  !*** ./src/pixi/effects/PixelDistort.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Utils.js */ "./src/pixi/core/Utils.js");

const def = _core_Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].def

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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PixelDistort);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/pixi/Pixi.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Color_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/Color.js */ "./src/pixi/core/Color.js");
/* harmony import */ var _core_Events_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/Events.js */ "./src/pixi/core/Events.js");
/* harmony import */ var _core_Scene_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/Scene.js */ "./src/pixi/core/Scene.js");
/* harmony import */ var _core_Shape_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/Shape.js */ "./src/pixi/core/Shape.js");
/* harmony import */ var _core_Utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/Utils.js */ "./src/pixi/core/Utils.js");
/* harmony import */ var _effects_PixelColorChange_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./effects/PixelColorChange.js */ "./src/pixi/effects/PixelColorChange.js");
/* harmony import */ var _effects_PixelDistort_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./effects/PixelDistort.js */ "./src/pixi/effects/PixelDistort.js");








const Pixi = {Color: _core_Color_js__WEBPACK_IMPORTED_MODULE_0__["default"], Events: _core_Events_js__WEBPACK_IMPORTED_MODULE_1__["default"], Scene: _core_Scene_js__WEBPACK_IMPORTED_MODULE_2__["default"], Shape: _core_Shape_js__WEBPACK_IMPORTED_MODULE_3__["default"], Utils: _core_Utils_js__WEBPACK_IMPORTED_MODULE_4__["default"], PixelColorChange: _effects_PixelColorChange_js__WEBPACK_IMPORTED_MODULE_5__["default"], PixelDistort: _effects_PixelDistort_js__WEBPACK_IMPORTED_MODULE_6__["default"]}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Pixi);
})();

Pixi = __webpack_exports__["default"];
/******/ })()
;
//# sourceMappingURL=pixi.js.map