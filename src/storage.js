

let db;
let dbVersion = 1;
let dbReady = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log('dom content loaded');
    list = document.querySelector('#list_of_images');

    document.querySelector('#pictureTest').addEventListener('change', doFile);

    // document.querySelector('#testImageBtn').addEventListener('click', doImageTest);

    initDb();

    
});

let list;

function initDb() {
    let request = indexedDB.open('testPics', dbVersion);

    request.onerror = function(e) {
        console.error('Unable to open database.');
    }

    request.onsuccess = function(e) {
        db = e.target.result;
        console.log('db opened', db);
        displayData()
    }

    request.onupgradeneeded = function(e) {
        let db = e.target.result;
        db.createObjectStore('cachedForms', {keyPath:'id', autoIncrement: true});
        dbReady = true;
    }
}



function doFile(e) {
  console.log('change event fired for input field');
  const files = e.target.files;
  
  // Создаем массив промисов для обработки каждого файла
  const filePromises = Array.from(files).map(file => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onload = function(e) {
              const bits = reader.result;
              const ob = {
                  created: new Date(),
                  data: bits,
                  filename: file.name // Добавляем имя файла для различения
              };
              resolve(ob);
          };
          
          reader.onerror = function(e) {
              reject(e);
          };
          
          reader.readAsDataURL(file);
      });
  });
  
  // Обрабатываем все файлы
  Promise.all(filePromises)
      .then(fileObjects => {
          const trans = db.transaction(['cachedForms'], 'readwrite');
          const store = trans.objectStore('cachedForms');
          
          // Добавляем каждый файл в базу данных
          fileObjects.forEach(ob => {
              const addReq = store.add(ob);
              
              addReq.onerror = function(e) {
                  console.log('error storing data for file:', ob.filename);
                  console.error(e);
              };
          });
          
          trans.oncomplete = function(e) {
              console.log('all files stored successfully');
              displayData();
          };
      })
      .catch(error => {
          console.log('Error processing files:');
          console.error(error);
      });
}

function doImageTest() {
    console.log('doImageTest');
    let image = document.querySelector('#testImage');
    let recordToLoad = parseInt(document.querySelector('#recordToLoad').value,10);
    if(recordToLoad === '') recordToLoad = 1;

    let trans = db.transaction(['cachedForms'], 'readonly');
    //hard coded id
    let req = trans.objectStore('cachedForms').get(recordToLoad);
    req.onsuccess = function(e) {
        let record = e.target.result;
        console.log('get success', record);
        image.src =  btoa(record.data);
    }
}

// Define the displayData() function
function displayData() {
    // Here we empty the contents of the list element each time the display is updated
    // If you didn't do this, you'd get duplicates listed each time a new note is added
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  
    // Open our object store and then get a cursor - which iterates through all the
    // different data items in the store
    const objectStore = db.transaction("cachedForms").objectStore("cachedForms");
    objectStore.openCursor().addEventListener("success", (e) => {
      // Get a reference to the cursor
      const cursor = e.target.result;
  
      // If there is still another data item to iterate through, keep running this code
      if (cursor) {
        console.log(cursor.value)
        // Create a list item, h3, and p to put each data item inside when displaying it
        // structure the HTML fragment, and append it inside the list
        const listItem = document.createElement("li");
        const h3 = document.createElement("h3");
        const para = document.createElement("p");
        let image = document.createElement("img")
        
        
  
        // // Put the data from the cursor inside the h3 and para
        // h3.textContent = cursor.value.title;
        // para.textContent = cursor.value.body;
        image.src = cursor.value.data;
        image.style = "width: 20%"

        listItem.appendChild(h3);
        listItem.appendChild(para);
        listItem.appendChild(image);
        list.appendChild(listItem);
  
        // Store the ID of the data item inside an attribute on the listItem, so we know
        // which item it corresponds to. This will be useful later when we want to delete items
        listItem.setAttribute("data-note-id", cursor.value.id);
  
        // Create a button and place it inside each listItem
        const deleteBtn = document.createElement("button");
        listItem.appendChild(deleteBtn);
        deleteBtn.textContent = "Delete";
  
        // Set an event handler so that when the button is clicked, the deleteItem()
        // function is run
        deleteBtn.addEventListener("click", deleteItem);
  
        // Iterate to the next item in the cursor
        cursor.continue();
      } else {
        // Again, if list item is empty, display a 'No notes stored' message
        if (!list.firstChild) {
          const listItem = document.createElement("li");
          listItem.textContent = "No notes stored.";
          list.appendChild(listItem);
        }
        // if there are no more cursor items to iterate through, say so
        console.log("Notes all displayed");
      }
    });
  }

  // Define the deleteItem() function
function deleteItem(e) {
    // retrieve the name of the task we want to delete. We need
    // to convert it to a number before trying it use it with IDB; IDB key
    // values are type-sensitive.
    const noteId = Number(e.target.parentNode.getAttribute('data-note-id'));
  
    // open a database transaction and delete the task, finding it using the id we retrieved above
    const transaction = db.transaction(['cachedForms'], 'readwrite');
    const objectStore = transaction.objectStore('cachedForms');
    const deleteRequest = objectStore.delete(noteId);
  
    // report that the data item has been deleted
    transaction.addEventListener('complete', () => {
      // delete the parent of the button
      // which is the list item, so it is no longer displayed
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);
      console.log(`Note ${noteId} deleted.`);
  
      // Again, if list item is empty, display a 'No notes stored' message
      if(!list.firstChild) {
        const listItem = document.createElement('li');
        listItem.textContent = 'No notes stored.';
        list.appendChild(listItem);
      }
    });
  }