/* global AFRAME */
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');

}

let m_images_list = []

let last_emited;
AFRAME.registerComponent('m-picture-container', {

    schema: {
    },
    update: function (oldData) {
    },
    init: function () {
        console.log("init", this.data)
    },
    tick: function (_, timeDelta) {
        let lstChild = this.el.lastElementChild
        
        if (!lstChild){
            return
        }
        if (lstChild.id == last_emited){
            return
        }
        
        // console.log(lstChild.object3D.position.z);
        if (lstChild.object3D.position.z > 0 + 2) {
            // console.log(lstChild)
            last_emited = lstChild.id
            this.el.emit("should_append")
        }
    },
    events:
    {
        click: function (evt) {
            
        }
    }
});

