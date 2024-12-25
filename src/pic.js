/* global AFRAME */
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

export const event = new Event("gone");

console.log("SDOFJSDPF!!")
export let speed = { value: 0.001};
AFRAME.registerComponent('m-picture', {

    schema: {
        // src: {type: "asset"},
        active: { type: "boolean" },
        dimensions: { type: "vec2" }
    },
    update: function (oldData) {
        console.log('oldData', oldData)

    },
    init: function () {
        console.log("init", this.data)

        let { xd, yd } = calculateAspectRatio(this.data.dimensions.x, this.data.dimensions.y)
        console.log('xd, yd:', xd, yd)
        let { xmeters, ymeters } = calculateDimensionsInMeters(xd, yd)
        console.log('xmeters, ymeters:', xmeters, ymeters)
        this.el.setAttribute("width", xmeters)
        this.el.setAttribute("height", ymeters)
        this.el.height = ymeters
    },
    tick: function (_, timeDelta) {
        // console.log("tick")
        this.el.object3D.position.z += speed.value * timeDelta;
        // console.log(speed.value)
        if (this.el.object3D.position.z > 20) {
            // console.log("GONE FROM TICK")
            this.el.remove()
        }
        // this.el. += 0.1 * timeDelta
    },
    events:
    {
        click: function (evt) {
            console.log('This entity was clicked!');
        }
    }
});

/**
 * Description
 * @param {number} width
 * @param {number} height
 * @returns {{x: number, y: number}}
 */
function calculateAspectRatio(width, height) {
    if (height === 0) {
        throw new Error("Height cannot be zero.");
    }

    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);

    return { xd: width / divisor, yd: height / divisor };
}


/**
 * Description
 * @param {number} width
 * @param {number} height
 * @returns {number}
 */
function calculateDimensionsInMeters(widthRatio, heightRatio) {

    if (isNaN(widthRatio) || isNaN(heightRatio) || widthRatio <= 0 || heightRatio <= 0) {
        throw new Error("Invalid aspect ratio. It should be positive numbers.");
    }

    const scale = 2 / Math.max(widthRatio, heightRatio);
    const scaledWidth = widthRatio * scale;
    const scaledHeight = heightRatio * scale;

    return { xmeters: scaledWidth, ymeters: scaledHeight };
}