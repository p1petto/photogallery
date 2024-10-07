'use strict';
document.addEventListener("DOMContentLoaded", function () {
    const positions = [
      { x: -2, y: 0, z: -8 }
    ];

    const scene = document.querySelector("a-scene");
    const entities = [];
    const maxZ = 10; // Конечная позиция z
    const distance = 5; // Расстояние на которое сдвигается элемент

    // Динамическое создание элементов с увеличением по оси z
    for (let i = 0; i < 5; i++) {
      const lastPosition = positions[positions.length - 1];
      const newZ = lastPosition.z + 2;
      const newPosition = { x: -2, y: 0, z: newZ };
      positions.push(newPosition);

      const entity = document.createElement("a-entity");
      entity.setAttribute("template", "src: #pic");
      entity.setAttribute("position", `${newPosition.x} ${newPosition.y} ${newPosition.z}`);
      entity.setAttribute("data-box1color", "red")
      
      // Добавляем анимацию перемещения
      entity.setAttribute("animation__move", `
        property: position;
        to: ${newPosition.x} ${newPosition.y} ${newPosition.z + distance};
        dur: 5000;
        easing: linear;
        loop: true;
      `);

      entities.push(entity); // Добавляем в массив entities
      scene.appendChild(entity);
    }

    // Обновляем позицию после завершения анимации
    entities.forEach((entity, index) => {
      entity.addEventListener("animationcomplete__move", function () {
        let currentPosition = entity.getAttribute("position");
        // Если элемент переместился за maxZ, перемещаем его в начало ряда
        if (currentPosition.z >= maxZ + distance) {
          entity.setAttribute("position", `${currentPosition.x} ${currentPosition.y} ${-8}`);
        }
      });
    });
});

