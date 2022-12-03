const express = require('express'); //подключение нужных библиотек
const XMLHttpRequest = require('xhr2');

const hostname = '127.0.0.1'; //хост
const port = 4000; //номер порта клиента
var checkers; //json пришедший с сервера
var chosen_ch; //json с выбранной шашкей
var move_ch; //json с координатами перемещения
var color_chCh, h_chCh, v_chCh, isQ_chCh, canB_chCh; //параметры выбранной шашки
var new_h_Ch, new_v_Ch; //координаты перемещения
var statuscode; //статус код, который будет отправлен в ответ к серверу
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
        //console.log(request.response); //вывод в консоль
        checkers = JSON.parse(request.response); //запись в переменную ответ с сервера
        res.status(200).json(checkers); //ну тут статус код
    }
})

//получение координат шашки, которой будут ходить
app.get('/chosen_checker', (req, res) => {
  const json = JSON.stringify({}); //создаем пустой json

  const req_chos_ch = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже

  req_chos_ch.open("GET", 'http://localhost:3000/choose'); //гет запрос на сервер
  req_chos_ch.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса

  req_chos_ch.send(json); //хз

  req_chos_ch.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
    if (req_chos_ch.response) {
      //статус код пришел
      console.log('1'); //вывод в консоль
      chosen_ch = JSON.parse(req_chos_ch.response); //запись в переменную ответ с сервера
      res.status(200).json(chosen_ch); //ну тут статус код
      //параметры выбранной шашки:
      color_chCh = chosen_ch.color; 
      h_chCh = chosen_ch.horiz;
      v_chCh = chosen_ch.vertic;
      isQ_chCh = chosen_ch.isQueen;
      canB_chCh = chosen_ch.canBeat;
      console.log('Coordinates of chosen', color_chCh, 'checker are:', h_chCh, v_chCh,
      '\nThis checker is queen:', isQ_chCh,'\nThis checker can beat:', canB_chCh);
    }
    else {
      console.log('2'); //вывод в консоль
      res.status(400).send({ status: "checker is not chosen" });  //статус код не пришел
      return;
    }  
  }
});

//получение координат перемещения текущей шашки
app.get('/checker_movement', (req, res) => {
  const json = JSON.stringify({}); //создаем пустой json

  const req_coord_ch = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже

  req_coord_ch.open("GET", 'http://localhost:3000/move_coord'); //гет запрос на сервер
  req_coord_ch.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса

  req_coord_ch.send(json); //хз

  req_coord_ch.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
    if (req_coord_ch.response) {
      //статус код пришел
      console.log('1'); //вывод в консоль
      move_ch = JSON.parse(req_coord_ch.response); //запись в переменную ответ с сервера
      res.status(200).json(move_ch); //ну тут статус код
      //параметры выбранной шашки: 
      new_h_Ch = move_ch.new_horiz;
      new_v_Ch = move_ch.new_vertic;
      console.log('New coordinates are:', new_h_Ch, new_v_Ch);
    }
    else {
      console.log('2'); //вывод в консоль
      res.status(400).send({ status: "new coordinates are not chosen" });  //статус код не пришел
      return;
    }  
  }
});

//При выполнении пост запроса мы выполняем перемещение шашки и вовзращаем статус выполнения
app.post('/', (req, res) => {
  //полученый в гет запросе json разбивают на локальные перменные
  //color_chCh, h_chCh, v_chCh, isQ_chCh, canB_chCh
  //var new_h_Ch, new_v_Ch
  console.log('Coordinates of', color_chCh, 'will be changed:\nfrom:', 
  h_chCh, v_chCh, '\nto:', new_h_Ch, new_v_Ch);

//Провести валидацию, возможно ли двинуть шашку на это место

active_color = []; //массив шашек текущего игрока
inactive_color = []; //массив шашек другого игрока
//Валидация цвета
  if (color_chCh == "white") {
    active_color = checkers.white; //запись всех элементов с цветом white в первый массив
    inactive_color = checkers.black; //black во второй массив
  }
  else 
  if (color_chCh == "black") {
    active_color = checkers.black; //тут все наоборот
    inactive_color = checkers.white;
  }
  else {
    statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
    res.status(400).send(statuscode);
    return;
  }

  console.log('Coordinates of current player:\n',
  'Before:', JSON.stringify(active_color, ['horiz', 'vertic'])); //вывод в консоль текущих координат
  //перемещаемой шашки
  //Ищем шашку и меняем параметры
  for (var i = 0; i < active_color.length; i++) {
    if (active_color[i].horiz == h_chCh)
      if (active_color[i].vertic == v_chCh) 
      {
        //Функция валидации хода
        busy = false; //false - свободно, true - занято
        for (var j = 0; j < active_color.length; j++)
          if (active_color[j].horiz == new_h_Ch)
            if (active_color[j].vertic == new_v_Ch) 
                busy = true;
        for (var j = 0; j < inactive_color.length; j++)
          if (inactive_color[j].horiz == new_h_Ch)
            if (inactive_color[j].vertic == new_v_Ch)
              busy = true;
        if (busy == false) {
          active_color[i].horiz = new_h_Ch;
          active_color[i].vertic = new_v_Ch;
          console.log(' After:', JSON.stringify(active_color, ['horiz', 'vertic']));
          //Вернуть статус-код выполнения задачи
          statuscode = ({ status: "ok" });
          res.status(200).send(statuscode);
          return;
        }
        else {
          console.log(' After: No changes');
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