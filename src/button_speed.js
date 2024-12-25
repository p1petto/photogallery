/* global AFRAME */
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

import {speed} from "./pic"

AFRAME.registerComponent('m-button-speed', {

    schema:{
        speed: {type: "number"}
    },
    update: function (oldData) {


    },
    init: function () {

    },
    tick: function (_, timeDelta) {

    },
    events:
    {
        click: function (evt) {
            console.log('This entity was clicked!');
            speed.value = this.data.speed
        }
    }
});
