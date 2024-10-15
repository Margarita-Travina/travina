document.addEventListener("DOMContentLoaded", function () {
  let listData = [{
    name: 'Илья',
    lastname: "Иванов",
    surname: "Олегович",
    birthday: new Date(1994, 5, 12),
    faculty: "Экономика",
    studyStart: 2010,
  },
  {
    name: 'Мария',
    lastname: "Иванова",
    surname: "Сергеевна",
    birthday: new Date(1995, 6, 11),
    faculty: "Экономика",
    studyStart: 2021,
  },
  {
    name: 'Мия',
    lastname: "Петрова",
    surname: "Александровна",
    birthday: new Date(1991, 11, 18),
    faculty: "Акушерство",
    studyStart: 2011,
  }, {
    name: 'Татьяна',
    lastname: "Иванова",
    surname: "Олеговена",
    birthday: new Date(1997, 4, 1),
    faculty: "Информатика",
    studyStart: 2016,
  }, {
    name: 'Виктория',
    lastname: "Миллер",
    surname: "Сергеевна",
    birthday: new Date(1993, 2, 2),
    faculty: "Ветеринария",
    studyStart: 2018,
  }
  ]


  //создание элементов

  const $app = document.getElementById('app'),
    $addForm = document.getElementById('add-form'),
    $nameInp = document.getElementById('name-inp'),
    $lastnameInp = document.getElementById('lastname-inp'),
    $surnameInp = document.getElementById('surname-inp'),
    $birthdayInp = document.getElementById('birthday-inp'),
    $facultyInp = document.getElementById('faculty-inp'),
    $startInp = document.getElementById('start-inp'),
    $addBtn = document.getElementById('form-btn'),


    $filterForm = document.getElementById('filter-form'),
    $fioFilterInp = document.getElementById('inp-fio'),
    $facultyFilterInp = document.getElementById('inp-faculty'),
    $startFilter = document.getElementById('inp-start'),
    $endFilter = document.getElementById('inp-end')

  $table = document.createElement('table'),
    $tableHead = document.createElement('thead'),
    $tableBody = document.createElement('tbody'),

    $tableHeadTr = document.createElement('tr'),
    $tableHeadThFIO = document.createElement('th'),
    $tableHeadThBirtYear = document.createElement('th'),
    $tableHeadThStudytDate = document.createElement('th'),
    $tableHeadThFaculty = document.createElement('th');

  $table.classList.add('table', 'table-secondary')
  $tableHeadTr.classList.add('table-info')

  $tableHeadThFIO.textContent = 'ФИО'
  $tableHeadThBirtYear.textContent = 'Дата рождения'
  $tableHeadThStudytDate.textContent = 'Год поступления'
  $tableHeadThFaculty.textContent = 'Факультет'

  $tableHeadTr.append($tableHeadThFIO)
  $tableHeadTr.append($tableHeadThBirtYear)
  $tableHeadTr.append($tableHeadThStudytDate)
  $tableHeadTr.append($tableHeadThFaculty)

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
      $userFaculty = document.createElement('th');

    $userFIO.textContent = oneUser.lastname + " " + oneUser.name + " " + oneUser.surname;
    $userBirtYear.textContent = createDateString(oneUser.birthday);
    $userStudytDate.textContent = createStudyStroke(oneUser.studyStart);
    $userFaculty.textContent = oneUser.faculty;


    $userTr.append($userFIO)
    $userTr.append($userBirtYear)
    $userTr.append($userStudytDate)
    $userTr.append($userFaculty)

    return $userTr

  }


  function createDateString(date) { //принимает обьект data и возвращает форматированную строку
    let age = calculateDate(date);
    return `${normalizeDateorMonth(date.getDate())}.${normalizeDateorMonth(date.getMonth() + 1)}.${date.getFullYear()} (${age} ${yearName(age)})`
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
  function validationDate(value, mistake) { //value - значение для проверки, mistake элемент для отображения ошибки
    if (isNaN(value)) { //проверяю является ли числом true не является числом, то появляется сообщение в элементе mistake
      mistake.textContent = "Вы не корректно заполнили дату";
      return false;
    } else {
      return checkBirthDate(value.getFullYear(), mistake);
    }
  }

  function createStudyStroke(studyStart) {
    let endYear = studyStart + 4;
    let nowDate = new Date().getFullYear();
    let course = nowDate > endYear ? `Закончил` : `${nowDate - studyStart} курс`;
    return `Годы обучения: ${studyStart}-${endYear} (${course})`
  }

  function getId(arr) {
    return arr.length ? arr[arr.length - 1].id + 1 : 1;
  }


  //валидация

  function validation(form) {

    let fieldValues = {}; // Объект для хранения значений полей ввода

    if (form.querySelectorAll(".error-label").length > 0) { //проверяем есть ли элементы в форме, если их колличество больше нуля то выполняю действие
      form.querySelectorAll(".error-label").forEach((el) => el.remove()); // удаляем все эллементы с классом
      form.querySelectorAll(".input-box").forEach((el) => el.classList.remove("error")); //удаляю класс error у всех элементов с классом
    }

    function createError(input, text) { // создание сообщения об ошибке
      const parent = input.parentNode;
      const errorLabel = document.createElement('label')

      errorLabel.classList.add('error-label')
      errorLabel.textContent = text

      parent.classList.add('error')
      parent.append(errorLabel)
    }


    let result = true; // инициализируется переменная result  со значеине true, будет использоваться для определения результата проверки

    const allInputs = form.querySelectorAll('input');  // получаю список полей

    for (const input of allInputs) {  // для каждого поля ввода происходит:
      fieldValues[input.id] = input.value;

      if (input.value.length < 2) {
        createError(input, "Колличество должно быть от 2 до 10");
        result = false;
      } else if (input.value.length > 10) {
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
      if (input.getAttribute("id") === "birthday-inp") {
        if (input.value === "") {
          createError(input, "Поле не заполнено!");
          result = false;
        } else {
          const year = new Date(input.value).getFullYear();
          if (year <= 1900 || year >= new Date().getFullYear()) {
            createError(input, `Дата рождения должна быть в диапазоне от 1900 до ${new Date().getFullYear()}`)
            result = false;
          }
        }
        if (input.getAttribute("id") === "name-inp") {
          if (input.value === "") {
            createError(input, "Заполните поле");
            result = false;
          } else {
            if (input.value.length < 2 || input.value.length > 10) {
              createError(input, "Колличество должно быть от 2 до 10");
              result = false;
            }
          }
        }
      }
      const startInput = document.getElementById("start-inp");
      const currentYear = new Date().getFullYear(); //получаем год из введенного поля

      startInput.addEventListener("input", function () {
        const startYear = parseInt(startInput.value);

        if (isNaN(startYear) || startYear < 2000 || startYear > currentYear) {
          removeError(startInput);
          createError(startInput, `Год поступления должен быть в диапазоне от 2000 до ${currentYear}`);
          result = false;
        }
      })
    }

    // Восстанавливаю значения полей ввода, если есть ошибки
    if (!result) {
      for (const input of allInputs) {
        input.value = fieldValues[input.id];
      }
    }
    return result //возвращает значение переменной, которое указывает на результат проверки формы

  }

  //Отрисовка
  for (const oneUser of listData) {
    const $newTr = createUserTr(oneUser)
    $tableBody.append($newTr)
  }

  document.getElementById('add-form').addEventListener('submit', function (event) {
    event.preventDefault()

    if (validation(this) == true) {
      let object = {
        name: $nameInp.value.trim(),
        lastname: $lastnameInp.value.trim(),
        surname: $surnameInp.value.trim(),
        birthday: new Date($birthdayInp.value.trim()),
        faculty: $facultyInp.value.trim(),
        studyStart: parseInt($startInp.value.trim())
      };

      listData.push(object)
      const $newTr = createUserTr(object)
      $tableBody.append($newTr);
      event.target.reset();
    }

  });

  //клики сортировки

  var headers = $tableHead.getElementsByTagName("th");

  // Добавляем обработчик клика к каждому заголовку столбца
  for (var i = 0; i < headers.length; i++) {
    headers[i].addEventListener('click', createSortHandler(i));
  }

  // Создаем функцию-обработчик события для каждого заголовка столбца
  function createSortHandler(column) {
    return function () {
      var rows = Array.from($tableBody.getElementsByTagName("tr"));


      // Определяем порядок сортировки (если столбец уже был отсортирован по возрастанию, сортируем по убыванию и наоборот)
      var sortingOrder = this.getAttribute("data-sorting-order");
      sortingOrder = sortingOrder === "asc" ? "desc" : "asc";

      // Сортируем данные в соответствии с выбранным столбцом и порядком сортировки
      rows.sort(function (a, b) {
        var aValue = a.getElementsByTagName("th")[column].textContent;
        var bValue = b.getElementsByTagName("th")[column].textContent;

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

      for (var j = 0; j < rows.length; j++) {
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

