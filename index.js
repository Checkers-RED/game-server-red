const express = require('express'); //подключение нужных библиотек
const XMLHttpRequest = require('xhr2');

const hostname = '127.0.0.1'; //хост
const port = 4000; //номер порта клиента
var checkers; //json пришедший с сервера
var statuscode; //статус код, который будет отправлен в ответ серверу
const app = express();
app.use(express.json());

//При отправлении гет запроса мы получаем данные ./checkers.json с сервера
app.get('/', (req, res) => {

    const json = JSON.stringify({}); //сначала создаем по сути пустой json

    const request = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже

    request.open("GET", 'http://localhost:3000/'); //гет запрос на сервер
    request.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса

    request.send(json); //хз

    request.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
        console.log(request.response); //вывод в консоль
        checkers = JSON.parse(request.response); //запись в переменную ответ с сервера
        res.status(200).json(checkers); //ну тут статус код
    }
})

//При выполнении пост запроса мы выполняем перемещение шашки и вовзращаем статус выполнения
app.post('/', function (req, res) {
  //полученый в гет запросе json разбивают на локальные перменные
  color = req.body.color;
  coordinate_x = req.body.coordinate_x;
  coordinate_y = req.body.coordinate_y;
  new_coordinate_x = req.body.new_coordinate_x;
  new_coordinate_y = req.body.new_coordinate_y;
  console.log('Coordinates of', color, 'will be changed:\nfrom:', 
  coordinate_x, coordinate_y, '\nto:', new_coordinate_x, new_coordinate_y);


//Провести валидацию, возможно ли двинуть шашку на это место

active_color = []; //массив шашек текущего игрока
inactive_color = []; //массив шашек другого игрока
//Валидация цвета
  if (color == "white") {
    active_color = checkers.white; //запись всех элементов с цветом white в первый массив
    inactive_color = checkers.black; //black во второй массив
    console.log('Before:', checkers.white); //вывод на консоль
  }
  else 
  if (color == "black") {
    active_color = checkers.black; //тут все наоборот
    inactive_color = checkers.white;
    console.log('Before:', checkers.black);
  }
  else {
    statuscode = { status: "error: no such color" }; //вывод ошибки если цвето неправильный
    res.status(400).send(statuscode);
    return;
  }

//Ищем шашку и меняем параметры
  for (var i = 0; i < active_color.length; i++) {
    if (active_color[i].coordinate_x == coordinate_x)
      if (active_color[i].coordinate_y == coordinate_y) 
      {
        //Функция валидации хода
        busy = 0; //0 - свободно, 1 - те же самые координаты, 2 - занято
        for (var j = 0; j < active_color.length; j++)
          if (active_color[j].coordinate_x == new_coordinate_x)
            if (active_color[j].coordinate_y == new_coordinate_y) {
              if (i == j)
                busy = 1;
              else
                busy = 2;
            }
        for (var j = 0; j < inactive_color.length; j++)
          if (inactive_color[j].coordinate_x == new_coordinate_x)
            if (inactive_color[j].coordinate_y == new_coordinate_y)
              busy = 2;
        if (busy == 0) {
          active_color[i].coordinate_x = new_coordinate_x;
          active_color[i].coordinate_y = new_coordinate_y;
          console.log('After:', active_color);
          //Вернуть статус-код выполнения задачи
          statuscode = ({ status: "ok" });
          res.status(200).send(statuscode);
          return;
        }
        else if (busy == 1) {
          console.log('After: No changes');
          //Вернуть статус-код о выборе тех же самых координат
          statuscode = ({ status: "checker got unselected" });
          res.status(300).send(statuscode);
          return;
        }
        else if (busy == 2) {
          console.log('After: No changes');
          //Вернуть статус-код ошибки выбора новых координат
          statuscode = ({ status: "error: this coordinates are already occupied" });
          res.status(400).send(statuscode);
          return;
        }
      }
  }

//Вернуть статус-код ошибки выполнения задачи
statuscode = ({ status: "error: no such checker" });
res.status(400).send(statuscode);
});
//гет запрос к которому обратится сервер чтобы принять статус код
app.get('/statuscode', (req, res) => {
  res.status(200).json(statuscode);
})

app.listen(port, () => { //клиент запущен
  console.log(`Client active on port ${port}`);
})