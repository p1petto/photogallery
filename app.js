'use strict';


document.addEventListener("DOMContentLoaded", function () {
    const positions = [
      { x: 0, y: 0, z: 5 }
    ];

    const scene = document.querySelector("a-scene");
    const entities = [];
    const maxZ = 10; 
    const distance = 5; 

    for (let i = 0; i < 5; i++) {
      const lastPosition = positions[positions.length - 1];
      const newZ = lastPosition.z + 2;
      const newPosition = { x:-6, y: 0, z: newZ };
      positions.push(newPosition);

      const entity = document.createElement("a-entity");
      entity.setAttribute("template", "src: #pic");
      entity.setAttribute("position", `${newPosition.x} ${newPosition.y} ${newPosition.z}`);
      entity.setAttribute("rotation", "180 -90 0");
      

      entities.push(entity); 
      scene.appendChild(entity);

      entity.addEventListener('templaterendered', function () {
        if (i === 2) { 
          const picLink = entity.querySelector(".pic-link");
          if (picLink) {
            picLink.setAttribute("material", "color", "red"); 
          }
        }
        
      });
    }

    
});
