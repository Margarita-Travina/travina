(function () {
  let listArray = [],
     listName = ''

  function createAppTitle(title) {  //создаем и возвращаем заголовок
    let appTitle = document.createElement('h2'); //помещаем DOM элемент
    appTitle.innerHTML = title; //присваиваем внутреннему содержимому title, который передаем в качестве аргумента
    return appTitle; //возвращаем
  }

  function createTodoItemForm() {   //создаем и возвращаем форму для создания дела
    let form = document.createElement('form'); // с-м сам элемент формы
    let input = document.createElement('input'); // с-м поле для ввода
    let buttonWrapper = document.createElement('div'); // в пременную buttonWrapper добавляем вспомогательный элемент, для правильной стилизации bootstrap
    let button = document.createElement('button'); // создаем кнопку
// расставляем атрибуты элементам
    form.classList.add('input-group', 'mb-3'); // input-group-стилизует группу элементов формы, mb-3-отступ после формы
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append'); // класс нужен для позициониравания
    button.classList.add('btn', 'btn-primary'); // btn- для всех стилей каждой кнопке в bootstrap, btn-primary-цвет, единственной или другой
    button.textContent = 'Добавить дело'; // отображение внутри кнопки
    button.disabled = true;
// обьединение в единную структуру
    buttonWrapper.append(button); // в buttonWrapper вкладываем button
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener('input', function() {
      if (input.value !== "") {
        button.disabled = false
      } else {
        button.disabled = true
      }
    })
// возвращаем результат
    return { // возвращаем обьект
      form,
      input,
      button,
    };
  }

  function createTodoList() {  //создаем и возвращаем список элементов
   let list = document.createElement('ul'); // создаем переменную и присваеваем ей новый элемент ul
   list.classList.add('list-group');
   return list;
  }

  function createTodoItem(obj) {
   let item = document.createElement('li');
   //помещаем в элемент кнопки
   let buttonGroup = document.createElement('div');
   let doneButton = document.createElement('button');
   let deleteButton = document.createElement('button');

   //устанавливаем стили для элементов списка и кнопок
   item.classList.add('list-group-item', 'd-flex',  'justify-content-between', 'align-items-center');
   item.textContent = obj.name;

   buttonGroup.classList.add('btn-group', 'btn-group-sm');
   doneButton.classList.add('btn', 'btn-success');
   doneButton.textContent = 'Готово';
   deleteButton.classList.add('btn', 'btn-danger');
   deleteButton.textContent = 'Удалить';

   if(obj.done==true) item.classList.add('list-group-item-success')

   doneButton.addEventListener('click', function(){
    item.classList.toggle('list-group-item-success')


    for (const listItem of listArray) {
     if(listItem.id == obj.id) listItem.done =!listItem.done
       }
       saveList(listArray, listName)
  })

   deleteButton.addEventListener('click', function(){
    if (confirm('Вы уверены')) {
      item.remove();

      for (let i = 0; i < listArray.length; i++) {
          if (listArray[i].id == obj.id) listArray.splice(i, 1)      }
    }
    saveList(listArray, listName)
  })
   //вкладываем кнопки в отдельный элемент
   buttonGroup.append(doneButton);
   buttonGroup.append(deleteButton);
   item.append(buttonGroup);

   return {
    item,
    doneButton,
    deleteButton,
   }
  }

  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id
    }
    return max + 1;
  }

  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr)); // делаем массив в виде строки
  }

  function createTodoApp(container, title = 'Список дел', keyName) {
  let todoAppTitle = createAppTitle(title);
  let todoItemForm = createTodoItemForm();
  let todoList = createTodoList();

  listName = keyName;

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  let localData = localStorage.getItem(listName)

  if (localData !== null && localData !== '') listArray = JSON.parse(localData) // превращаем обратно в массив

  for (const itemList of listArray) {
    let todoItem = createTodoItem(itemList);
    todoList.append(todoItem.item);
  }

  todoItemForm.form.addEventListener('submit', function(e) { //добавляем событие, для отправки
    e.preventDefault();

    if (!todoItemForm.input.value){ // если форма пустая, отправки не будет
      return;
    }

    let newItem = {
      id: getNewID(listArray),
      name: todoItemForm.input.value,
      done: false
    }

    let todoItem = createTodoItem(newItem);


    listArray.push(newItem)

    saveList(listArray, listName)

    todoList.append(todoItem.item);

    todoItemForm.button.disabled = true;
    todoItemForm.input.value = '';
  })
  }

   window.createTodoApp = createTodoApp;

}
) ();
