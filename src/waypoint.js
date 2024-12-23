
export default  {
    schema: {
        offset: { type: 'number', default: 0 }
    },
    init: function (data) {
        let offset = this.data.offset;
        console.log("HEAR")
        this.el.addEventListener('click', function (evt) {
            console.log("NNEEEEAR")
            document.querySelector('a-scene').querySelector('#view').setAttribute('position', {
                x: this.getAttribute('position').x,
                y: this.getAttribute('position').y + offset,
                z: this.getAttribute('position').z
            });
        });
    }
}


