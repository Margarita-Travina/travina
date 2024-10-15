const SERVER_URL = 'http://localhost:3000'

async function serverAddStudent(obj) { // добавление нового студента на сервер
  let response = await fetch(SERVER_URL + '/api/students', {
    method: "POST",  //метод отправки
    headers: { 'Content-Type': 'application/json' }, //тип, заголовки
    body: JSON.stringify(obj),
  });

  let data = null;
  if (response.ok) {
    data = await response.json();
  }

  return data
}

async function serverGetStudents() { //получение данных при загрузке страницы
  let response = await fetch(SERVER_URL + '/api/students', {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }, //тип, заголовки
  })

  let data = await response.json()

  return data
}

document.addEventListener("DOMContentLoaded", async function () {

  let serverData = await serverGetStudents()
  let listData = []

  if (serverData) {
    listData = serverData
  }

  async function serverDeleteStudent(id) { // удаление
    const response = await fetch(SERVER_URL + '/api/students/' + id, {
      method: "DELETE",  //метод отправки
    });

    let data = false;

    if (response.ok) {
      data = true;
    }

    return data;
  }

  //создание элементов

  const $app = document.getElementById('app');
  const $nameInp = document.getElementById('name-inp');
  const $lastnameInp = document.getElementById('lastname-inp');
  const $surnameInp = document.getElementById('surname-inp');
  const $birthdayInp = document.getElementById('birthday-inp');
  const $facultyInp = document.getElementById('faculty-inp');
  const $startInp = document.getElementById('start-inp');
  const $addBtn = document.getElementById('form-btn');


  const $filterForm = document.getElementById('filter-form');
  const $fioFilterInp = document.getElementById('inp-fio');
  const $facultyFilterInp = document.getElementById('inp-faculty');
  const $startFilter = document.getElementById('inp-start');
  const $endFilter = document.getElementById('inp-end');

  const $table = document.createElement('table');
  const $tableHead = document.createElement('thead');
  const $tableBody = document.createElement('tbody');

  const $tableHeadTr = document.createElement('tr');
  const $tableHeadThFIO = document.createElement('th');
  const $tableHeadThBirtYear = document.createElement('th');
  const $tableHeadThStudytDate = document.createElement('th');
  const $tableHeadThFaculty = document.createElement('th');
  const $tableHeadThAction = document.createElement('th');

  $table.classList.add('table', 'table-secondary');
  $tableHeadTr.classList.add('table-info')

  $tableHeadThFIO.textContent = 'ФИО'
  $tableHeadThBirtYear.textContent = 'Дата рождения'
  $tableHeadThStudytDate.textContent = 'Год поступления'
  $tableHeadThFaculty.textContent = 'Факультет'
  $tableHeadThAction.textContent = 'Действие'

  $tableHeadTr.append($tableHeadThFIO)
  $tableHeadTr.append($tableHeadThBirtYear)
  $tableHeadTr.append($tableHeadThStudytDate)
  $tableHeadTr.append($tableHeadThFaculty)
  $tableHeadTr.append($tableHeadThAction)


  $tableHead.append($tableHeadTr)
  $table.append($tableHead)
  $table.append($tableBody)
  $app.append($table)


  //создание одного пользователя

  function createUserTr(oneUser) {
    const $userTr = document.createElement('tr'),
      $userFIO = document.createElement('th'),
      $userBirtYear = document.createElement('th'),
      $userStudytDate = document.createElement('th'),
      $userFaculty = document.createElement('th'),
      $userDelete = document.createElement('th'),
      $deleteBtn = document.createElement('button');
    $userTr.setAttribute('data-id', oneUser.id); // Добавляю атрибут data-id со значением id студента


    // Добавляю обработчик события на кнопку удаления
    $deleteBtn.textContent = 'Удалить';
    $deleteBtn.classList.add('btn', 'btn-danger', 'w-100');
    $deleteBtn.addEventListener('click', async function () {
      const isRemoved = await serverDeleteStudent(oneUser.id);

      if (isRemoved) {
        const index = listData.findIndex((student) => student.id === oneUser.id);
        if (index !== -1) {
          listData.splice(index, 1);
        }
        renderTable(listData);
      }

    });

    $userFIO.textContent = oneUser.lastname + " " + oneUser.name + " " + oneUser.surname;
    $userBirtYear.textContent = createDateString(oneUser.birthday);
    $userStudytDate.textContent = createStudyStroke(oneUser.studyStart);
    $userFaculty.textContent = oneUser.faculty;

    $userDelete.append($deleteBtn);
    $userTr.append($userFIO)
    $userTr.append($userBirtYear)
    $userTr.append($userStudytDate)
    $userTr.append($userFaculty)
    $userTr.append($userDelete);

    return $userTr

  }


  function createDateString(date) { //принимает обьект data и возвращает форматированную строку
    const dateObject = new Date(date)
    let age = calculateDate(dateObject)
    return `${normalizeDateorMonth(dateObject.getDate())}.${normalizeDateorMonth(dateObject.getMonth() + 1)}.${dateObject.getFullYear()} (${age} ${yearName(age)})`
  }

  function normalizeDateorMonth(num) {
    return num <= 9 ? `0${num}` : `${num}`;
  }

  function calculateDate(age) { //принимает обьект даты рождения и вычисляет возраст на основе текущей даты
    let dateNow = new Date();
    let yearNow = dateNow.getFullYear();
    return yearNow - age.getFullYear();
  }

  function yearName(age) {
    if (age >= 10 && age <= 20) {
      return "лет";
    } else {
      if (age % 10 === 1) {
        return "год";
      } else if (age % 10 > 1 && age % 10 < 5) {
        return "года";
      } else {
        return "лет";
      }
    }

  }
  listData.forEach(oneUser => {
    $birthdayInp.append(oneUser);
  })


  function createStudyStroke(studyStart) {
    let endYear = Number(studyStart) + 4;
    let nowDate = new Date().getFullYear();
    let course = nowDate > endYear ? `Закончил` : `${nowDate - studyStart} курс`;
    return `Годы обучения: ${studyStart}-${endYear} (${course})`
  }

  function getId(arr) {
    return arr.length ? arr[arr.length - 1].id + 1 : 1;
  }


  //валидация

  function createError(input, text) { // создание сообщения об ошибке
    const parent = input.parentNode;
    const errorLabel = document.createElement('label')

    errorLabel.classList.add('error-label')
    errorLabel.textContent = text

    parent.classList.add('error')
    parent.append(errorLabel)
  }

  let result = true; // инициализируется переменная result  со значеине true, будет использоваться для определения результата проверки

  function validation(form) {

    let fieldValues = {}; // Объект для хранения значений полей ввода

    if (form.querySelectorAll(".error-label").length > 0) { //проверяем есть ли элементы в форме, если их колличество больше нуля то выполняю действие
      form.querySelectorAll(".error-label").forEach((el) => el.remove()); // удаляем все эллементы с классом
      form.querySelectorAll(".input-box").forEach((el) => el.classList.remove("error")); //удаляю класс error у всех элементов с классом
    }


    const allInputs = form.querySelectorAll('input');  // получаю список полей

    for (const input of allInputs) {  // для каждого поля ввода происходит:
      fieldValues[input.id] = input.value;

      if (input.value.length < 2 || input.value.length > 10) {
        createError(input, "Колличество должно быть от 2 до 10");
        result = false;
      } else {
        result = true;
      }


      if (input.required == "true") {
        if (input.value == "") {
          createError(input, `Поле не заполнено!`)
          result = false
        } else {
          result = true
        }
      }

      switch (input.getAttribute("id")) {
        case "birthday-inp":
          if (!input.value) {
            createError(input, "Поле не заполнено!");
            result = false;
          } else {
            const birthday = new Date(input.value);
            const currentYear = new Date().getFullYear();

            if (isNaN(birthday) || birthday.getFullYear() <= 1900 || birthday.getFullYear() >= currentYear) {
              createError(input, `Дата рождения должна быть в диапазоне от 1900 до ${currentYear - 1}`);
              result = false;
            }
          }
          break;
        case "start-inp":
          if (input.value === "") {
            createError(input, "Поле не заполнено!");
            result = false;
          } else {
            const startYear = parseInt(input.value);
            const currentYear = new Date().getFullYear();

            if (startYear < 2000 || startYear > currentYear) {
              createError(input, `Год начала обучения должен быть в диапазоне от 2000 до ${currentYear}`);
              result = false;
            }
          }
          return result;
      }

    }

    // Восстанавливаю значения полей ввода, если есть ошибки
    if (!result) {
      for (const input of allInputs) {
        input.value = fieldValues[input.id];
      }
    }
    //return result //возвращает значение переменной, которое указывает на результат проверки формы

  }

  function renderTable(stArr) {
    $tableBody.innerHTML = '';
    //Отрисовка
    for (const oneUser of stArr) {
      const $newTr = createUserTr(oneUser)
      $tableBody.append($newTr);
    }
  }
  // Рисую таблицу при загрузке страницы
  renderTable(listData);

  document.getElementById('add-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    if (validation(this)) {
      let object = {
        name: $nameInp.value.trim(),
        lastname: $lastnameInp.value.trim(),
        surname: $surnameInp.value.trim(),
        birthday: new Date($birthdayInp.value.trim()),
        faculty: $facultyInp.value.trim(),
        studyStart: parseInt($startInp.value.trim())
      };

      let serverDataObj = await serverAddStudent(object)

      if (serverDataObj.status !== null) {
        listData.push(serverDataObj);
        renderTable(listData);
        event.target.reset(); //сбрасываю форму

        // Удаляю сообщение об ошибке для поля даты рождения
        const birthdayInput = document.getElementById('birthday-inp');
        const errorLabel = birthdayInput.parentNode.querySelector('.error-label');
        if (errorLabel) {
          errorLabel.remove();
        }
        birthdayInput.parentNode.classList.remove('error');

      } else {
        console.log('Валидация не пройдена, студент не добавлен в таблицу');
      }
    }
  });

  //клики сортировки

  let headers = $tableHead.getElementsByTagName("th");

  // Добавляем обработчик клика к каждому заголовку столбца
  for (let i = 0; i < headers.length; i++) {
    headers[i].addEventListener('click', createSortHandler(i));
  }

  // Создаем функцию-обработчик события для каждого заголовка столбца
  function createSortHandler(column) {
    return function () {
      let rows = Array.from($tableBody.getElementsByTagName("tr"));


      // Определяем порядок сортировки (если столбец уже был отсортирован по возрастанию, сортируем по убыванию и наоборот)
      let sortingOrder = this.getAttribute("data-sorting-order");
      sortingOrder = sortingOrder === "asc" ? "desc" : "asc";

      // Сортируем данные в соответствии с выбранным столбцом и порядком сортировки
      rows.sort(function (a, b) {
        let aValue = a.getElementsByTagName("th")[column].textContent;
        let bValue = b.getElementsByTagName("th")[column].textContent;

        if (sortingOrder === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }

      });

      console.log(rows)
      // Обновляем отображение таблицы с отсортированными данными
      $tableBody.innerHTML = "";
      $tableHead.appendChild(headers[0].parentNode);

      for (let j = 0; j < rows.length; j++) {
        $tableBody.appendChild(rows[j]);
      }

      // Изменяем порядок сортировки для будущих кликов на этом столбце
      this.setAttribute("data-sorting-order", sortingOrder);
    }
  }

  //фильтрация

  function filterData() {
    // Весь результат
    let result = listData

    // Фильтруем по ФИО
    if ($fioFilterInp.value) {
      // Оставляем только отфильтрованные элементы
      result = result.filter(function (oneUser) {
        const FIO = oneUser.name + " " + oneUser.surname + " " + oneUser.lastname;
        return FIO.toLowerCase().includes($fioFilterInp.value.trim().toLowerCase());
      })
    }

    // Фильтруем по факультету
    if ($facultyFilterInp.value) {
      result = result.filter(function (oneUser) {
        return oneUser.faculty.toLowerCase().includes($facultyFilterInp.value.trim().toLowerCase());
      })
    }

    // Фильтруем по началу обучения
    if ($startFilter.value) {
      result = result.filter(function (oneUser) {
        return oneUser.studyStart === parseInt($startFilter.value)
      })
    }

    // Фильтруем по окончанию обучения
    if ($endFilter.value) {
      result = result.filter(function (oneUser) {
        return (oneUser.studyStart + 4) === parseInt($endFilter.value)
      })
    }

    render(result)

    return result;
  }

  $addBtn.addEventListener("click", filterData)

  function render(filteredArray) {
    $tableBody.innerHTML = '';
    for (const oneUser of filteredArray) {
      const $newTr = createUserTr(oneUser);
      $tableBody.append($newTr);
    }
  }

  $filterForm.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keyup", () => {
      let filteredArray;
      switch (input.getAttribute("id")) {
        case "inp-fio":
          filteredArray = filterData(listData, "FIO", input.value);
          break;
        case "inp-faculty":
          filteredArray = filterData(listData, "faculty", input.value);
          break;
        case "inp-start":
        case "inp-end":
          filteredArray = filterData(listData, "studyStart", input.value);
          break;
      }
      render(filteredArray);
    });
  });

})

