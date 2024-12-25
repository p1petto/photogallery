// 'use strict';

// import _ from './pic'
require("aframe")
require("aframe-environment-component")
import waypoint from "./waypoint";
require("./pic")
require("./pic_container")
require("./button_speed")
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}



AFRAME.registerComponent('waypointSelf', waypoint);


AFRAME.registerComponent('m-global-storage', {

  schema: {
  },
  update: function (oldData) {
    console.log('oldData', oldData)

  },
  init: function () {
    console.log("init GLOBAL")

    initDb()


  },
  tick: function (_, timeDelta) {

  },
  events: {
    should_append: async function (evt) {
      console.log('This entity should be added');
       await createImageEntity()
    }
  }
});


let db;
let dbGenerator;
let dbVersion = 1;
let images_container;

document.addEventListener('DOMContentLoaded', () => {

  images_container = document.querySelector('#images_container');

});

function initDb() {
  let request = indexedDB.open('testPics', dbVersion);

  request.onerror = function (e) {
    console.error('Unable to open database.');
  }

  request.onsuccess = function (e) {
    db = e.target.result;
    dbGenerator = createIndexedDbGenerator(db, "cachedForms")
    createImageEntity()

    console.log('db opened', db);
    // injectImages()
  }

  request.onupgradeneeded = function (e) {
    let db = e.target.result;
    db.createObjectStore('cachedForms', { keyPath: 'id', autoIncrement: true });
    dbGenerator = createIndexedDbGenerator(db, "cachedForms")
    dbReady = true;
  }
}


async function createImageEntity() {

  console.log("createImageEntity")
  const image_data = await dbGenerator.next();
  console.log("image_data", image_data);
  let image = document.createElement("a-image");

  image.setAttribute("m-picture", "active: true; dimensions: 1920 1080");
  image.setAttribute("id", `im_${image_data.value.id}`);
  image.setAttribute("src", image_data.value.data);
  image.setAttribute("position", `-2 1.5 0`);
  image.setAttribute("rotation", "0 90 0");


  images_container.appendChild(image);


}

async function* createIndexedDbGenerator(db, storeName, cacheSize = 1) {

try {
    let currentKey = undefined;
    
    while (true) {
        // Создаем новую транзакцию для каждой записи
        const record = await new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            
            // Если ключ не определен, берем первую запись
            // Иначе берем следующую запись после текущего ключа
            const request = currentKey === undefined 
                ? store.openCursor()
                : store.openCursor(IDBKeyRange.lowerBound(currentKey, true));

            request.onerror = () => reject(request.error);
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    currentKey = cursor.key;
                    resolve(cursor.value);
                } else {
                    resolve(null); // Больше записей нет
                }
            };
        });

        if (record === null) {
          currentKey = undefined
          continue;
        }

        yield record;
    }
} finally {
    db.close();
}
}













