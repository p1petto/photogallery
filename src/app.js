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

  // initDb();
  images_container = document.querySelector('#images_container');
  // images_container.addEventListener(
  //   "gone",
  //   (e) => {
  //    console.log("gone")
  //   },
  //   false,
  // );
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

// let images_list = []
// let images_counter = 0
// function injectImages() {
//   let counter = 0
//   const objectStore = db.transaction("cachedForms").objectStore("cachedForms");
//   objectStore.openCursor().addEventListener("success", (e) => {
//     // Get a reference to the cursor
//     const cursor = e.target.result;

//     // If there is still another data item to iterate through, keep running this code
//     if (!cursor) {
//       console.log("no images ...")
//       createImageEntity()
//       // setInterval(createImageEntity, 3600 * 5)
//       return
//     }
//     console.log(cursor.value)



//     let image = document.createElement("a-image");
//     // images_container.appendChild(image)

//     image.setAttribute("m-picture", "active: true; dimensions: 1920 1080")
//     image.setAttribute("id", `im_${cursor.value.id}`)
//     image.setAttribute("src", cursor.value.data);
//     image.setAttribute("position", `-2 1.5 ${7 - counter}`);
//     image.setAttribute("rotation", "0 90 0");
//     images_list.push({ data: cursor.value.data, id: cursor.value.id })
//     counter += 3
//     cursor.continue();

//   })


// }

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
  const cursorCache = [];
  let cursor = null;
  let cursorRequest;
  let isCursorActive = false; // Флаг активности курсора

  console.log("hello1")
  const getNextCursorResult = async () => {
    console.log("getNextCursor.start");
    
    return new Promise((resolve, reject) => {
      console.log("getNextCursor.afterreturn", cursor);
      if (cursor === null) {
        const transaction = db.transaction(storeName, "readonly");
        const objectStore = transaction.objectStore(storeName);
        cursorRequest = objectStore.openCursor();
        cursorRequest.onsuccess = () => {
          const result = cursorRequest.result;
          if (result) {
            resolve(result);
          } else {
            resolve(null);
          }
        };
        cursorRequest.onerror = () => reject(cursorRequest.error);
      }
      else{
        resolve(cursor)
      }
      console.log("getNextCursor.afterNULLCURSOR");


    });
  };

  const fillCache = async () => {
    console.log("fillCache.start", cursorCache)
    while (cursorCache.length < cacheSize && !isCursorActive) {
      console.log("fillCache.after_while", cursorCache.length)
      isCursorActive = true; // Устанавливаем флаг активности
       cursor = await getNextCursorResult();
      console.log("fillCache.body", cursor)
      if (cursor) {
        cursorCache.push(cursor.value); // Кешируем значение
        console.log("fillCache.predcontinue", cursor)
        cursor.continue(); // Переход к следующей записи
        console.log("fillCache.postcontinue", cursor)
      } else {
        cursorRequest = null; // Сбрасываем курсор при достижении конца
        break;
      }
      isCursorActive = false; // Сбрасываем флаг активности
      console.log("fillCache.end", cursorCache)
    }
  };

  while (true) {
    console.log("hello")
    if (cursorCache.length === 0) {
      await fillCache();
      console.log("awaitig for null cursor", cursorCache)
      if (cursorCache.length === 0) {
        // Если больше нет записей, начинаем сначала
        cursorRequest = null;
        await fillCache();
        console.log("awaitig for null cursor")
      }
    }
    console.log("yeild state",cursorCache)
    const record = cursorCache.shift(); // Получаем первую запись из кеша
    yield record;
    console.log("waiting after yield")

    // Подготавливаем следующую запись
    if (cursorCache.length < cacheSize) {
      console.log("waiting after (if) yield")
      await fillCache();
    }
  }
}













