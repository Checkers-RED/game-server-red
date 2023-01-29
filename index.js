const e = require('express');
const express = require('express'); //подключение нужных библиотек
const cors = require('cors');
const XMLHttpRequest = require('xhr2');

const port = 4040; //номер порта клиента

const server_ip_address = "85.143.223.149" //ip сервера БД
const server_port = 2020 //порт сервера БД

//var checkers; //json пришедший с сервера
//var BeatFlag = false; //флаг возможности нанести ударный ход

//var chosen_ch; //json с выбранной шашкой
//var move_ch; //json с координатами перемещения //совместить с chosen_ch для /move

const app = express();
app.use(express.json());
app.use(cors());

/*//При отправлении гет запроса мы получаем данные ./checkers.json с сервера
app.get('/session_checkers', (req, res) => {
    const json = JSON.stringify({}); //сначала создаем по сути пустой json

    const request = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже

    //request.open("POST", `http://${server_ip_address}:${server_port}/SessionСheckers`); //гет запрос на сервер
    request.open("GET", 'http://localhost:3000/'); //гет запрос на сервер
    request.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса
    request.send(json);

    request.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
        //console.log(request.response); //вывод в консоль
        checkers = JSON.parse(request.response); //запись в переменную ответ с сервера
        res.status(200).json(checkers); //ну тут статус код
    }
})*/

//получение полного списка шашек
function extractCheckers(req, callback) { //extractCheckers(req, function(checkers) {...})
try { //валидация успешна
  var cur_ses = req.body.current_session;
  var json = JSON.stringify({"current_session": cur_ses});
  const request = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже
  //request.open("POST", `http://${server_ip_address}:${server_port}/SessionСheckers`); //гет запрос на сервер
  request.open("POST", `http://localhost:3000/`); //гет запрос на сервер
  request.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса
  request.send(json); //хз
  request.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
    var checkers = JSON.parse(request.response); //запись в переменную ответ с сервера
    console.log('extractCheckers_ok'); //вывод в консоль
    callback(checkers); 
  }
}
catch {
  console.log('extractCheckers_err'); //вывод в консоль
  return 0; //подозрительное преобразование типов
}
}

//получение полного списка шашек
function extractActiveColor(req, callback) { //extractActiveColor(req, function(active_color) {...})
  try { //валидация успешна
    var cur_ses = req.body.current_session;
    var json = JSON.stringify({"current_session": cur_ses});
    const request = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже
    //request.open("POST", `http://${server_ip_address}:${server_port}/GetActiveColor`); //гет запрос на сервер
    request.open("POST", `http://localhost:3000/GetActiveColor`); //гет запрос на сервер
    request.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса
    request.send(json); //хз
    request.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
      var active_color = JSON.parse(request.response); //запись в переменную ответ с сервера
      console.log('extractActiveColor_ok'); //вывод в консоль
      callback(active_color.active_color); 
    }
  }
  catch {
    console.log('extractActiveColor_err'); //вывод в консоль
    return 0; //подозрительное преобразование типов
  }
}

//получение флага ударного хода
function extractBeatFlag(req, callback) { //extractBeatFlag(req, function(BeatFlag) {...})
  try { //валидация успешна
    var cur_ses = req.body.current_session;
    var json = JSON.stringify({"current_session": cur_ses});
    const request = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже
    //request.open("POST", `http://${server_ip_address}:${server_port}/GetBeatFlag`); //гет запрос на сервер
    request.open("POST", `http://localhost:3000/GetBeatFlag`); //гет запрос на сервер
    request.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса
    request.send(json); //хз
    request.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
      var BeatFlag = JSON.parse(request.response); //запись в переменную ответ с сервера
      console.log('extractBeatFlag_ok'); //вывод в консоль
      callback(BeatFlag.beat_flag); 
    }
  }
  catch {
    console.log('extractBeatFlag_err'); //вывод в консоль
    return 0; //подозрительное преобразование типов
  }
}

//установка флага ударного хода
function SetBeatFlag(req, BeatFlag, callback) { //SetBeatFlag(req, BeatFlag, function(callback) {...})
  try { //валидация успешна
    var cur_ses = req.body.current_session;
    var json = JSON.stringify({"current_session": cur_ses, "beat_flag": BeatFlag});
    const request = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже
    //request.open("POST", `http://${server_ip_address}:${server_port}/SetBeatFlag`); //гет запрос на сервер
    request.open("POST", `http://localhost:3000/SetBeatFlag`); //гет запрос на сервер
    request.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса
    request.send(json); //хз
    request.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
      var statuscode = JSON.parse(request.response); //запись в переменную ответ с сервера
      console.log('SetBeatFlag_ok'); //вывод в консоль
      callback(statuscode); 
    }
  }
  catch {
    console.log('SetBeatFlag_err'); //вывод в консоль
    return 0; //подозрительное преобразование типов
  }
}

//обновление списка шашек
function UpdateCheckersField(req, checkers, chosen_ch, movedChecker, callback) {
//UpdateCheckersField(req, checkers, function(callback) {...})
  try { //валидация успешна
    var cur_ses = req.body.current_session;
    var json = JSON.stringify({"current_session": cur_ses, "white": checkers.white, 
                "black": checkers.black, "previous_horiz": chosen_ch.horiz,
                "previous_vertic": chosen_ch.vertic, 
                "new_horiz": movedChecker.horiz,
                "new_vertic": movedChecker.vertic,});
    const request = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже
    //request.open("POST", `http://${server_ip_address}:${server_port}/UpdateCheckersField`); //гет запрос на сервер
    request.open("POST", `http://localhost:3000/UpdateCheckersField`); //гет запрос на сервер
    request.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса
    request.send(json); //хз
    request.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
      var statuscode = JSON.parse(request.response); //запись в переменную ответ с сервера
      console.log('UpdateCheckersField_ok'); //вывод в консоль
      callback(statuscode); 
    }
  }
  catch {
    console.log('UpdateCheckersField_err'); //вывод в консоль
    return 0; //подозрительное преобразование типов
  }
}

//установка флага ударного хода
function SetActiveColor(req, color, callback) { //SetActiveColor(req, color, function(callback) {...})
  try { //валидация успешна
    var cur_ses = req.body.current_session;
    var json = JSON.stringify({"current_session": cur_ses, "active_color": color});
    const request = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже
    //request.open("POST", `http://${server_ip_address}:${server_port}/SetActiveColor`); //гет запрос на сервер
    request.open("POST", `http://localhost:3000/SetActiveColor`); //гет запрос на сервер
    request.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса
    request.send(json); //хз
    request.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
      var statuscode = JSON.parse(request.response); //запись в переменную ответ с сервера
      console.log('SetActiveColor_ok'); //вывод в консоль
      callback(statuscode); 
    }
  }
  catch {
    console.log('SetActiveColor_err'); //вывод в консоль
    return 0; //подозрительное преобразование типов
  }
}

//установка цвета победителя
function SetWinnerColor(req, color, callback) { //SetWinnerColor(req, color, function(callback) {...})
  try { //валидация успешна
    var cur_ses = req.body.current_session;
    var json = JSON.stringify({"current_session": cur_ses, "winner_color": color});
    const request = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже
    //request.open("POST", `http://${server_ip_address}:${server_port}/SetWinnerColor`); //гет запрос на сервер
    request.open("POST", `http://localhost:3000/SetWinnerColor`); //гет запрос на сервер
    request.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса
    request.send(json); //хз
    request.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
      console.log('SetWinnerColor_ok'); //вывод в консоль
      var statuscode = JSON.parse(request.response); //запись в переменную ответ с сервера
      callback(statuscode); 
    }
  }
  catch {
    console.log('SetWinnerColor_err'); //вывод в консоль
    return 0; //подозрительное преобразование типов
  }
}

//получение координат шашки, которой будут ходить
/*app.get('/chosen_checker', (req, res) => {
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
      console.log('Coordinates of chosen', chosen_ch.color, 
      'checker are:', chosen_ch.horiz, chosen_ch.vertic,
      '\nThis checker is queen:', chosen_ch.isQueen);
    }
    else {
      console.log('2'); //вывод в консоль
      res.status(400).send({ status: "checker is not chosen" });  //статус код не пришел
      return;
    }  
  }
});*/

//получение данные о шашке, которой будут ходить
function extractChosenCh(req) { //var chosen_ch = extractChosenCh(req);
  try {
    var full_user_input = req.body; //запись в переменную ответ с сервера
    //параметры выбранной шашки:
    color_chCh = full_user_input.color;
    h_chCh = full_user_input.horiz;
    v_chCh = full_user_input.vertic;
    isQ_chCh = full_user_input.isQueen;
    console.log('Coordinates of chosen', color_chCh, 'checker are:', h_chCh, v_chCh,
                '\nThis checker is queen:', isQ_chCh);
    console.log('extractChosenCh_ok'); //вывод в консоль
    return JSON.parse(
            JSON.stringify(
                    {"color": color_chCh, "horiz": h_chCh, 
                    "vertic": v_chCh, "isQueen": isQ_chCh}
                    ));
  }
  catch {
      console.log('extractChosenCh_err'); //вывод в консоль
      return 0; //подозрительное преобразование типов
  }
}

//получение координат перемещения текущей шашки
/*app.get('/checker_movement', (req, res) => {
  const json = JSON.stringify({}); //создаем пустой json

  const req_coord_ch = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже

  req_coord_ch.open("GET", 'http://localhost:3000/move_coord'); //гет запрос на сервер
  req_coord_ch.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса

  req_coord_ch.send(json); //хз

  req_coord_ch.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
    if (req_coord_ch.response) {
      //статус код пришел
      //console.log('1'); //вывод в консоль
      move_ch = JSON.parse(req_coord_ch.response); //запись в переменную ответ с сервера
      res.status(200).json(move_ch); //ну тут статус код
      //параметры выбранной шашки: 
      console.log('New coordinates are:', move_ch.horiz, move_ch.vertic);
    }
    else {
      //console.log('2'); //вывод в консоль
      res.status(400).send({ status: "new coordinates are not chosen" });  //статус код не пришел
      return;
    }  
  }
});*/

//получение координат перемещения шашки
function extractCheckerMovement(req) { //var move_ch = extractCheckerMovement(req);
  try {
    var full_user_input = req.body; //запись в переменную ответ с сервера
    //параметры выбранной шашки: 
    new_h_Ch = full_user_input.new_horiz;
    new_v_Ch = full_user_input.new_vertic;
    console.log('New coordinates are:', new_h_Ch, new_v_Ch);
    console.log('extractCheckerMovement_ok'); //вывод в консоль
    return JSON.parse(
            JSON.stringify({"new_horiz": new_h_Ch, "new_vertic": new_v_Ch}));
  }
  catch {
      console.log('extractCheckerMovement_err'); //вывод в консоль
      return 0; //подозрительное преобразование типов
  }
}

//------------------РУССКИЕ ШАШКИ------------------------

//набор функций, которые будут использоваться для различных проверок:
//проверка доступности тихого хода простой шашки:
function reg_move_not_Q_check(OurCH, EnCH, checker) {
  var reg_moves = []; //список тихих ходов
  var brfl = false; //вспомогательный флаг удаления записи из список
  //изначально записываем все возможные тихие ходы шашки:
  if (checker.color == "white") {
    reg_moves[0] = { horiz: checker.horiz+1, vertic: checker.vertic+1 };
    reg_moves[1] = { horiz: checker.horiz+1, vertic: checker.vertic-1 };
  }
  else 
  if (checker.color == "black") {
    reg_moves[0] = { horiz: checker.horiz-1, vertic: checker.vertic+1 };
    reg_moves[1] = { horiz: checker.horiz-1, vertic: checker.vertic-1 };
  }
  //теперь удалим из списка те ходы, которые ограничены:
  for (var i = 0; i < reg_moves.length; i++) { 
    //сначала проверим на выход за границы игровой доски:
    if ((reg_moves[i].horiz < 1 || reg_moves[i].horiz > 8) || 
      (reg_moves[i].vertic < 1 || reg_moves[i].vertic > 8)) {
        reg_moves.splice(i,1);
        i--;
        continue;
      }
    //потом проверим свободно ли поле, на которое перемещается шашка:
    //есть ли в полях союзные шашки?:
    for (var j = 0; j < OurCH.length; j++)
      if (OurCH[j].horiz == reg_moves[i].horiz)
        if (OurCH[j].vertic == reg_moves[i].vertic) {
          reg_moves.splice(i,1);
          brfl = true;
          break;
        }
    //есть ли в полях шашки оппонента?:
    if ( brfl == false) {
      for (var j = 0; j < EnCH.length; j++)
      if (EnCH[j].horiz == reg_moves[i].horiz)
        if (EnCH[j].vertic == reg_moves[i].vertic) {
          reg_moves.splice(i,1);
          brfl = true;
          break;
        }
    }
    if (brfl == true) {
      i--;
      brfl = false;
    }
  }
  return reg_moves;
}

//проверка доступности тихого хода дамки:
function reg_move_Q_check(OurCH, EnCH, checker) {
  var reg_moves = []; //список тихих ходов
  var brfl = false; //вспомогательный флаг прерывания записи в список
  var count = 0; //номер в списке ходов
  //будем искать тихие ходы во всех 4 направлениях:
  //вниз-влево:
  for (var k = 0; k < 8; k++) { //будем считать до 8, так как это максимум на доске
    //сначала посмотрим, является ли поле занято другой шашкой
    for (var j = 0; j < OurCH.length; j++) {
      var h = checker.horiz-(k+1);
      var v = checker.vertic-(k+1);
      if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
        brfl = true; //если да, то поиск прекращается в этом направлении
        break;
      }
    }
    for (var j = 0; j < EnCH.length; j++) {
      var h = checker.horiz-(k+1);
      var v = checker.vertic-(k+1);
      if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    //так же проверяется, не вышла ли проверка за границы игровой доски
    if (h < 1 || v < 1 || brfl == true) {
      brfl = false;
      break;
    }
    //если ни одно из условий не нарушено, то поле записывается в список
    reg_moves[count] = { horiz: h, vertic: v };
    count++;
  }
  //вниз-вправо:
  for (var k = 0; k < 8; k++) {
    for (var j = 0; j < OurCH.length; j++) {
      var h = checker.horiz-(k+1);
      var v = checker.vertic+(k+1);
      if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    for (var j = 0; j < EnCH.length; j++) {
      var h = checker.horiz-(k+1);
      var v = checker.vertic+(k+1);
      if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    if (h < 1 || v > 8 || brfl == true) {
      brfl = false;
      break;
    }
    reg_moves[count] = { horiz: h, vertic: v };
    count++;
  }
  //вверх-влево:
  for (var k = 0; k < 8; k++) {
    for (var j = 0; j < OurCH.length; j++) {
      var h = checker.horiz+(k+1);
      var v = checker.vertic-(k+1);
      if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    for (var j = 0; j < EnCH.length; j++) {
      var h = checker.horiz+(k+1);
      var v = checker.vertic-(k+1);
      if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    if (h > 8 || v < 1 || brfl == true) {
      brfl = false;
      break;
    }
    reg_moves[count] = { horiz: h, vertic: v };
    count++;
  }
  //вверх-вправо:
  for (var k = 0; k < 8; k++) {
    for (var j = 0; j < OurCH.length; j++) {
      var h = checker.horiz+(k+1);
      var v = checker.vertic+(k+1);
      if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    for (var j = 0; j < EnCH.length; j++) {
      var h = checker.horiz+(k+1);
      var v = checker.vertic+(k+1);
      if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    if (h > 8 || v > 8 || brfl == true) {
      brfl = false;
      break;
    }
    reg_moves[count] = { horiz: h, vertic: v };
    count++;
  }
  return reg_moves;
}

//проверка доступности ударного хода простой шашки:
function beat_move_not_Q_check(OurCH, EnCH, checker) {
  var beat_moves = []; //список ударных ходов
  var enemy_check = []; //вспомогательный список полей с потеницальной шашкой оппонента
  var brfl = false; //вспомогательный флаг удаления записи из список
  //изначально записываем все возможные ударные ходы шашки и поля с потеницальной шашкой врага:
  beat_moves[0] = { horiz: checker.horiz+2, vertic: checker.vertic+2 };
  beat_moves[1] = { horiz: checker.horiz+2, vertic: checker.vertic-2 };
  beat_moves[2] = { horiz: checker.horiz-2, vertic: checker.vertic+2 };
  beat_moves[3] = { horiz: checker.horiz-2, vertic: checker.vertic-2 };
  enemy_check[0] = { horiz: checker.horiz+1, vertic: checker.vertic+1 };
  enemy_check[1] = { horiz: checker.horiz+1, vertic: checker.vertic-1 };
  enemy_check[2] = { horiz: checker.horiz-1, vertic: checker.vertic+1 };
  enemy_check[3] = { horiz: checker.horiz-1, vertic: checker.vertic-1 };
  //теперь удалим из списка те ходы, которые ограничены:
  for (var i = 0; i < beat_moves.length; i++) { 
    //сначала проверим на выход за границы игровой доски:
    if ((beat_moves[i].horiz < 1 || beat_moves[i].horiz > 8) || 
      (beat_moves[i].vertic < 1 || beat_moves[i].vertic > 8)) {
        beat_moves.splice(i,1);
        enemy_check.splice(i,1);
        i--;
        continue;
      }
    //потом проверим на то, находится ли на пути шашка оппонента:
    brfl = true;
    for (var j = 0; j < EnCH.length; j++) 
      if (EnCH[j].horiz == enemy_check[i].horiz)
        if (EnCH[j].vertic == enemy_check[i].vertic) {
          //убедимся, что эта шашка не является уже побитой
          if (EnCH[j].isBeaten == false) {
            brfl = false;
            break;
          }
        }
    //после проверим свободно ли поле, на которое перемещается шашка:
    //есть ли в полях союзные шашки?:
    if (brfl == false) {
      for (var j = 0; j < OurCH.length; j++) 
      if (OurCH[j].horiz == beat_moves[i].horiz)
        if (OurCH[j].vertic == beat_moves[i].vertic) {
          brfl = true;
          break;
        }
    }
    //есть ли в полях шашки оппонента?:
    if (brfl == false) {
      for (var j = 0; j < EnCH.length; j++) 
        if (EnCH[j].horiz == beat_moves[i].horiz)
          if (EnCH[j].vertic == beat_moves[i].vertic) {
            brfl = true;
            break;
          }
    }
    if (brfl == true) {
      beat_moves.splice(i,1);
      enemy_check.splice(i,1);
      i--;
      brfl = false;
    }
  }
  //console.log('Potential enemy checkers:', enemy_check);
  return beat_moves;
}

//проверка доступности ударного хода дамки:
function beat_move_Q_check(OurCH, EnCH, checker) {
  var beat_moves = []; //список ударных ходов
  var enemy_check = []; //вспомогательный список полей с шашкой оппонента
  var brfl = false; //вспомогательный флаг прерывания записи в список
  var enfl = false; //флаг нахождения шашки оппонента
  var count = 0; //номер в списке ходов
  var countEn = 0; //номер в списке полей с шашкой оппонента
  //будем искать ударные ходы во всех 4 направлениях:
  //вниз-влево:
  for (var k = 0; k < 8; k++) { //будем считать до 8, так как это максимум на доске
    //разделим проверку на 2 части:
    //1) проверка свободных полей ДО шашки оппонента
    if (enfl == false){
      //сначала посмотрим, является ли поле занято шашкой ОППОНЕНТА
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz-(k+1);
        var v = checker.vertic-(k+1);
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          //сначала убедимся, что эта шашка не является уже побитой
          if(EnCH[j].isBeaten == true) {
            brfl = true; //если является, то поиск прекращается в этом направлении
            break;
          }
          //в ином же случае шашка оппонента является потеницально подходящей
          enfl = true; //активируется флаг нахождения шашки оппонента
          //в список записывается поле с шашкой оппонента
          enemy_check[countEn] = { horiz: h, vertic: v };
          countEn++;
          break;
        }
      }
      //потом проверим, а не занято ли поле нашей шашкой, что уже является препядствием
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz-(k+1);
        var v = checker.vertic-(k+1);
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true; //если да, то поиск прекращается в этом направлении
          break;
        }
      }
      //так же проверяется, не вышла ли проверка за границы игровой доски
      if (h < 1 || v < 1 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
    }
    //2) проверка свободных полей ПОСЛЕ шашки оппонента
    else {
      //сначала посмотрим, является ли поле занято другой шашкой
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz-(k+1);
        var v = checker.vertic-(k+1);
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true; //если да, то поиск прекращается в этом направлении
          break;
        }
      }
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz-(k+1);
        var v = checker.vertic-(k+1);
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      //так же проверяется, не вышла ли проверка за границы игровой доски
      if (h < 1 || v < 1 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
      //если ни одно из условий не нарушено, то поле записывается в список
      beat_moves[count] = { horiz: h, vertic: v };
      count++;
    }   
  }
  //вниз-вправо:
  for (var k = 0; k < 8; k++) {
    if (enfl == false) {
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz-(k+1);
        var v = checker.vertic+(k+1);
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          if(EnCH[j].isBeaten == true) {
            brfl = true;
            break;
          }
          enfl = true;
          enemy_check[countEn] = { horiz: h, vertic: v };
          countEn++;
          break;
        }
      }
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz-(k+1);
        var v = checker.vertic+(k+1);
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      if (h < 1 || v > 8 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
    }
    else {
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz-(k+1);
        var v = checker.vertic+(k+1);
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz-(k+1);
        var v = checker.vertic+(k+1);
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      if (h < 1 || v > 8 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
      beat_moves[count] = { horiz: h, vertic: v };
      count++;
    }
  }
  //вверх-влево:
  for (var k = 0; k < 8; k++) {
    if (enfl == false) {
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz+(k+1);
        var v = checker.vertic-(k+1);
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          if(EnCH[j].isBeaten == true) {
            brfl = true;
            break;
          }
          enfl = true;
          enemy_check[countEn] = { horiz: h, vertic: v };
          countEn++;
          break;
        }
      }
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz+(k+1);
        var v = checker.vertic-(k+1);
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      if (h > 8 || v < 1 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
    }
    else {
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz+(k+1);
        var v = checker.vertic-(k+1);
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz+(k+1);
        var v = checker.vertic-(k+1);
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      if (h > 8 || v < 1 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
      beat_moves[count] = { horiz: h, vertic: v };
      count++;
    }
  }
  //вверх-вправо:
  for (var k = 0; k < 8; k++) {
    if (enfl == false) {
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz+(k+1);
        var v = checker.vertic+(k+1);
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          if(EnCH[j].isBeaten == true) {
            brfl = true;
            break;
          }
          enfl = true;
          enemy_check[countEn] = { horiz: h, vertic: v };
          countEn++;
          break;
        }
      }
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz+(k+1);
        var v = checker.vertic+(k+1);
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      if (h > 8 || v > 8 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
    }
    else {
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz+(k+1);
        var v = checker.vertic+(k+1);
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz+(k+1);
        var v = checker.vertic+(k+1);
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      if (h > 8 || v > 8 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
      beat_moves[count] = { horiz: h, vertic: v };
      count++;
    }
  }
  //console.log('Potential enemy checkers:', enemy_check);
  return beat_moves;
}

//вывод списка шашек с доступным ходом
function checkersCanMove(active_Ch, inactive_Ch, BeatFlag) {
 checkersCM = [];
 for (var i = 0; i < active_Ch.length; i++) {
  checkersCM[i] = { horiz: active_Ch[i].horiz, vertic: active_Ch[i].vertic,
                    isQueen: active_Ch[i].isQueen, color: active_Ch[i].color };
 }
  if (BeatFlag == true) {
    for (var i = 0; i < checkersCM.length; i++) {
      if (checkersCM[i].isQueen == true) 
        moves = beat_move_Q_check(active_Ch, inactive_Ch, checkersCM[i]);
      else moves = beat_move_not_Q_check(active_Ch, inactive_Ch, checkersCM[i]);
      if (moves.length == 0) {
        checkersCM.splice(i,1);
        i--;
      }
    }
  }
  else {
    for (var i = 0; i < checkersCM.length; i++) {
      if (checkersCM[i].isQueen == true) 
        moves = reg_move_Q_check(active_Ch, inactive_Ch, checkersCM[i]);
      else moves = reg_move_not_Q_check(active_Ch, inactive_Ch, checkersCM[i]);
      if (moves.length == 0) {
        checkersCM.splice(i,1);
        i--;
      }
    }
  }
  return checkersCM;
}

//проверка на то, может ли простая шашка превратится в дамку
function can_turn_Q_check(color, movedChecker) {
  var horiz_to_check; //выбирается, какая диагональ будет чекатся
  var Qfl = false; //возвращаемый флаг превращения в дамку
  if (color == "white") horiz_to_check = 8;
  else if (color == "black") horiz_to_check = 1;
  if (movedChecker.horiz == horiz_to_check) Qfl = true;
  return Qfl;
}

//произведение ударного хода
function beating(checker, move, enemy_checkers) {
  //начальные и конечные координаты, в пределах которых ищется шашка оппонента
  var h1, h2, v1, v2;
  var c = 0; //вспомогательный счетчик для определения направления
  //сначала зададим конечные координаты для горизонтали и вертикали
  if (checker.horiz > move.new_horiz) {
    h1 = move.new_horiz+1; //h1 всегда нижняя горизонталь
    h2 = checker.horiz-1; //h2 - верхняя
    c++;
  }
  else {
    h1 = checker.horiz+1;
    h2 = move.new_horiz-1;
  }
  if (checker.vertic > move.new_vertic) {
    v1 = move.new_vertic+1; //v1 всегда левая вертикаль
    v2 = checker.vertic-1; //v2 - правая
    c++;
  }
  else {
    v1 = checker.vertic+1;
    v2 = move.new_vertic-1;
  }
  //теперь в цикле будем искать координаты шашки оппонента в пределах этих границ пошагово
  for (var h_comp = h1; h_comp < h2+1; h_comp++) {
    for (var v_comp = v1; v_comp < v2+1; v_comp++) {
      //Оба цикла идут на увеличение, однако в одной из двух диагоналей при увеличении одной
      //координаты, другая уменьшается. С помощью счетчика с проверяется, на какой диагонали 
      //производится ударный ход. При необходимости, направление одной из координаты меняется.
      var vv_comp;
      if (c != 1) vv_comp = v_comp;
      else vv_comp = v2-(v_comp-v1);
      //производится поиск шашки оппонента с заданными координатами
      for (var k = 0; k < enemy_checkers.length; k++) {
        if (enemy_checkers[k].horiz == h_comp)
          if (enemy_checkers[k].vertic == vv_comp) {
            enemy_checkers[k].isBeaten = true; //когда она найдена, ей задается статус "побита"
            return enemy_checkers; //возвращается измененный список всех шашек оппонента
          }
      }
    }
  }
  return 0;
}

//проверка на то, что шашка может нанести еще один ударный ход
function addit_beat_move_check(OurCH, EnCH, movedChecker) {
  var bfl = false;
  moves = []; //массив доступных ходов перемещенной шашки
  //проверка на возможность игроком нанести еще один ударный ход
  if (movedChecker.isQueen == true) moves = beat_move_Q_check(OurCH, EnCH, movedChecker);
  else moves = beat_move_not_Q_check(OurCH, EnCH, movedChecker);
  if (moves.length > 0) bfl = true;
  console.log('Player can make another beat move?:', bfl);
  return moves; //вывод ходов, если они имеются
}


//пост запрос в начале хода для различных проверок
app.post('/ru_turn_begin', (req, res) => {
  extractCheckers(req, function(checkers) {
    extractActiveColor(req, function(active_color) {
      active_Ch = []; //массив шашек текущего игрока
      inactive_Ch = []; //массив шашек другого игрока
      moves = []; //массив доступных ходов выбранной шашки
      var statuscode; //статус код, который будет отправлен в ответ к серверу
      var BeatFlag = false; //флаг возможности нанести ударный ход
      //Валидация цвета
      if (active_color == "white") {
        active_Ch = checkers.white; //запись всех элементов с цветом white в первый массив
        inactive_Ch = checkers.black; //black во второй массив
      }
      else if (active_color == "black") {
        active_Ch = checkers.black; //тут все наоборот
        inactive_Ch = checkers.white;
      }
      else {
        statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
        res.status(400).send(statuscode);
        return;
      }
      //проверка на возможность игроком нанести ударный ход
      for (var i = 0; i < active_Ch.length; i++) {
        if (active_Ch[i].isQueen == true) 
          moves = beat_move_Q_check(active_Ch, inactive_Ch, active_Ch[i]);
        else moves = beat_move_not_Q_check(active_Ch, inactive_Ch, active_Ch[i]);
        if (moves.length > 0) {
          BeatFlag = true;
          break;
        }
      }
      //составление списка шашек которые могут ходить (для бота)
      var checkersWmoves = checkersCanMove(active_Ch, inactive_Ch, BeatFlag);
      console.log('Player can make a beat move?:', BeatFlag);
      SetBeatFlag(req, BeatFlag, function(statuscode) {
        if (statuscode) {        
          res.status(200).json(checkersWmoves);
          return;
        }
      })
    })
  })
})

//Пост запрос на вывод списка доступных ходов при пришедших данных о выбранной шашке
app.post('/ru_available_moves', (req, res) => {
  extractCheckers(req, function(checkers) {
    var chosen_ch = extractChosenCh(req);
    extractActiveColor(req, function(active_color) {
      extractBeatFlag(req, function(BeatFlag) {
        var active_Ch = []; //массив шашек текущего игрока
        var inactive_Ch = []; //массив шашек другого игрока
        var moves = []; //массив доступных ходов выбранной шашки
        var statuscode; //статус код, который будет отправлен в ответ к серверу
        //Валидация цвета
        if (active_color == "white") {
          active_Ch = checkers.white; //запись всех элементов с цветом white в первый массив
          inactive_Ch = checkers.black; //black во второй массив
        }
        else if (active_color == "black") {
          active_Ch = checkers.black; //тут все наоборот
          inactive_Ch = checkers.white;
        }
        else {
          statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
          res.status(400).send(statuscode);
          return;
        }

        //Составление списка доступных тихих или ударных ходов выбранной шашки:
        if (BeatFlag == true) {
          if (chosen_ch.isQueen == true) moves = beat_move_Q_check(active_Ch, inactive_Ch, chosen_ch);
          else moves = beat_move_not_Q_check(active_Ch, inactive_Ch, chosen_ch);
        }
        else {
          if (chosen_ch.isQueen == true) moves = reg_move_Q_check(active_Ch, inactive_Ch, chosen_ch);
          else moves = reg_move_not_Q_check(active_Ch, inactive_Ch, chosen_ch);
        }

        console.log('Available moves of this checker are:\n', moves); //вывод списка ходов в консоль
        res.status(200).json(moves); //отправка списка доступных ходов клиенту
      })
    })
  })
});

//Пост запрос на перемещение выбранной шашки в выбранные координаты
app.post('/ru_move', (req, res) => {
  extractCheckers(req, function(checkers) {
    var chosen_ch = extractChosenCh(req);
    var move_ch = extractCheckerMovement(req);
    extractActiveColor(req, function(active_color) {
      extractBeatFlag(req, function(BeatFlag) {
        var active_Ch = []; //массив шашек текущего игрока
        var inactive_Ch = []; //массив шашек другого игрока
        var moves = []; //массив доступных ходов выбранной шашки
        var statuscode; //статус код, который будет отправлен в ответ к серверу
        var comp_flag = false; //флаг выполнения задачи
        //Валидация цвета
        if (active_color == "white") {
          active_Ch = checkers.white; //запись всех элементов с цветом white в первый массив
          inactive_Ch = checkers.black; //black во второй массив
        }
        else if (active_color == "black") {
          active_Ch = checkers.black; //тут все наоборот
          inactive_Ch = checkers.white;
        }
        else {
          statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
          res.status(400).send(statuscode);
          return;
        }

        //Составление списка доступных тихих или ударных ходов выбранной шашки:
        if (BeatFlag == true) {
          if (chosen_ch.isQueen == true) moves = beat_move_Q_check(active_Ch, inactive_Ch, chosen_ch);
          else moves = beat_move_not_Q_check(active_Ch, inactive_Ch, chosen_ch);
        }
        else {
          if (chosen_ch.isQueen == true) moves = reg_move_Q_check(active_Ch, inactive_Ch, chosen_ch);
          else moves = reg_move_not_Q_check(active_Ch, inactive_Ch, chosen_ch);
        }

        //Ищем шашку и меняем параметры
        for (var i = 0; i < active_Ch.length; i++) {
          if (active_Ch[i].horiz == chosen_ch.horiz)
            if (active_Ch[i].vertic == chosen_ch.vertic) 
            {
              //Функция валидации хода
              var valid_move = false; //false - ход запрещен, true - ход разрешен
              for (var j = 0; j < moves.length; j++)
                if (moves[j].horiz == move_ch.new_horiz)
                  if (moves[j].vertic == move_ch.new_vertic)
                  valid_move = true;
              if (valid_move == true) {
                //если валидация пройдена, то шашка перемещается на новые координаты:
                active_Ch[i].horiz = move_ch.new_horiz;
                active_Ch[i].vertic = move_ch.new_vertic;
                //проверка на то, дошла или шашка до последней горизонтали
                var Qfl = can_turn_Q_check(active_Ch[i].color, active_Ch[i]);
                //если да, то она сразу превращается в дамку
                if (Qfl) active_Ch[i].isQueen = true;
                //console.log('Parameters of moved checker:', JSON.stringify(movedChecker));
                //если это ударный ход, то шашка оппонента становится побитой
                if (BeatFlag == true)
                  inactive_Ch = beating(chosen_ch, move_ch, inactive_Ch);
                //console.log('Enemy checkers after beating move:', inactive_Ch);
                //составим данные о перемещенной шашке, чтобы отправить ее клиенту
                var movedChecker = JSON.parse(JSON.stringify(
                          {"color": active_Ch[i].color, "horiz": active_Ch[i].horiz, 
                          "vertic": active_Ch[i].vertic, "isQueen": active_Ch[i].isQueen}
                          ));
                comp_flag = true;
                UpdateCheckersField(req, checkers, chosen_ch, movedChecker, function(statuscode) {
                  console.log('List of all checkers after move:', JSON.stringify(checkers));
                  if (statuscode)
                    res.status(200).json(movedChecker);
                  return;
                })
              }
              else {
                //Вернуть статус-код ошибки выбора новых координат
                statuscode = ({ status: "error: this move is not valid" });
                res.status(400).send(statuscode);
                return;
              }
            }
        }
        if (!comp_flag) {
          //Вернуть статус-код ошибки выполнения задачи
          statuscode = ({ status: "error: no such checker" });
          res.status(400).send(statuscode);
        }
      })
    })
  })
});

//Пост запрос на выполнение ряда действий после совершения хода игроком
app.post('/ru_after_move', (req, res) => {
  extractCheckers(req, function(checkers) {
    var movedChecker = extractChosenCh(req); //данные о перемещенной шашке
    extractActiveColor(req, function(active_color) {
      extractBeatFlag(req, function(BeatFlag) {
        var active_Ch = []; //массив шашек текущего игрока
        var inactive_Ch = []; //массив шашек другого игрока
        var addit_moves = []; //массив доступных ходов выбранной шашки
        var statuscode; //статус код, который будет отправлен в ответ к серверу
        //Валидация цвета
        if (active_color == "white") {
          active_Ch = checkers.white; //запись всех элементов с цветом white в первый массив
          inactive_Ch = checkers.black; //black во второй массив
        }
        else if (active_color == "black") {
          active_Ch = checkers.black; //тут все наоборот
          inactive_Ch = checkers.white;
        }
        else {
          statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
          res.status(400).send(statuscode);
          return;
        }
        //Проверим, какое дальше действие должно произойти
        //Если ход был ударный, то...
        if (BeatFlag == true) {
          //Далее предпринимается попытка составить список следующих ударных ходов
          addit_moves = addit_beat_move_check(active_Ch, inactive_Ch, movedChecker);
          //Если доп ходы нашлись, то их список отправляется игроку
          if (addit_moves.length > 0) {
            console.log('Additional available moves of this checker are:\n', addit_moves);
            res.status(200).json(addit_moves); //отправка списка доступных ходов клиенту
          }
          //Если же нет, то ход игрока завершается
          else {
            //Удалим все съеденные шашки оппонента
            for (var i = 0; i < inactive_Ch.length; i++) { 
              if (inactive_Ch[i].isBeaten == true) {
                  inactive_Ch.splice(i,1);
                  i--;
                }
            }
            //Если шашек оппонента больше нет, то игра завершается
            if (inactive_Ch.length == 0) {
              SetWinnerColor(req, active_color, function(statuscode) {
                console.log(`End of the game!${active_color} has won!`);
                res.status(200).send(statuscode);
                return;
              })
            }
            //Если же еще остались, то завершается ход
            else {      
              SetActiveColor(req, inactive_Ch[0].color, function(statuscode) {
                if (statuscode) {
                  var ph = []; ph.horiz = 0; ph.vertic = 0;
                  UpdateCheckersField(req, checkers, ph, ph, function(statuscode) {
                    console.log('List of all checkers after end of turn:', JSON.stringify(checkers));
                    console.log('End of turn');
                    res.status(200).send(statuscode);
                    return;
                  })
                }
              })
            }
          }
        }
        //Если же ход был простой, то он сразу же завершается
        else {
          SetActiveColor(req, inactive_Ch[0].color, function(statuscode) {
            console.log('End of turn');
            res.status(200).send(statuscode);
            return;
          })
        }
      })
    })
  })
});

//------------------АНГЛИЙСКИЕ ШАШКИ------------------------

//набор функций, которые будут использоваться для различных проверок:
//проверка доступности тихого хода простой шашки:
function reg_move_not_Q_check_en(OurCH, EnCH, checker) {
  var reg_moves = []; //список тихих ходов
  var brfl = false; //вспомогательный флаг удаления записи из список
  //изначально записываем все возможные тихие ходы шашки:
  if (checker.color == "white") {
    reg_moves[0] = { horiz: checker.horiz+1, vertic: checker.vertic+1 };
    reg_moves[1] = { horiz: checker.horiz+1, vertic: checker.vertic-1 };
  }
  else 
  if (checker.color == "black") {
    reg_moves[0] = { horiz: checker.horiz-1, vertic: checker.vertic+1 };
    reg_moves[1] = { horiz: checker.horiz-1, vertic: checker.vertic-1 };
  }
  //теперь удалим из списка те ходы, которые ограничены:
  for (var i = 0; i < reg_moves.length; i++) { 
    //сначала проверим на выход за границы игровой доски:
    if ((reg_moves[i].horiz < 1 || reg_moves[i].horiz > 8) || 
      (reg_moves[i].vertic < 1 || reg_moves[i].vertic > 8)) {
        reg_moves.splice(i,1);
        i--;
        continue;
      }
    //потом проверим свободно ли поле, на которое перемещается шашка:
    //есть ли в полях союзные шашки?:
    for (var j = 0; j < OurCH.length; j++)
      if (OurCH[j].horiz == reg_moves[i].horiz)
        if (OurCH[j].vertic == reg_moves[i].vertic) {
          reg_moves.splice(i,1);
          brfl = true;
          break;
        }
    //есть ли в полях шашки оппонента?:
    if (brfl == false) {
      for (var j = 0; j < EnCH.length; j++)
        if (EnCH[j].horiz == reg_moves[i].horiz)
          if (EnCH[j].vertic == reg_moves[i].vertic) {
            reg_moves.splice(i,1);
            brfl = true;
            break;
          }
    }
    if (brfl == true) {
      i--;
      brfl = false;
    }
  }
  return reg_moves;
}

//проверка доступности тихого хода дамки:
function reg_move_Q_check_en(OurCH, EnCH, checker) {
  var reg_moves = []; //список тихих ходов
  var brfl = false; //вспомогательный флаг удаления записи из список
  //изначально записываем все возможные тихие ходы шашки:
  reg_moves[0] = { horiz: checker.horiz+1, vertic: checker.vertic+1 };
  reg_moves[1] = { horiz: checker.horiz+1, vertic: checker.vertic-1 };
  reg_moves[2] = { horiz: checker.horiz-1, vertic: checker.vertic+1 };
  reg_moves[3] = { horiz: checker.horiz-1, vertic: checker.vertic-1 };
  //теперь удалим из списка те ходы, которые ограничены:
  for (var i = 0; i < reg_moves.length; i++) { 
    //сначала проверим на выход за границы игровой доски:
    if ((reg_moves[i].horiz < 1 || reg_moves[i].horiz > 8) || 
      (reg_moves[i].vertic < 1 || reg_moves[i].vertic > 8)) {
        reg_moves.splice(i,1);
        i--;
        continue;
      }
    //потом проверим свободно ли поле, на которое перемещается шашка:
    //есть ли в полях союзные шашки?:
    for (var j = 0; j < OurCH.length; j++)
      if (OurCH[j].horiz == reg_moves[i].horiz)
        if (OurCH[j].vertic == reg_moves[i].vertic) {
          reg_moves.splice(i,1);
          brfl = true;
          break;
        }
    //есть ли в полях шашки оппонента?:
    if (brfl == false) {
      for (var j = 0; j < EnCH.length; j++)
        if (EnCH[j].horiz == reg_moves[i].horiz)
          if (EnCH[j].vertic == reg_moves[i].vertic) {
            reg_moves.splice(i,1);
            brfl = true;
            break;
          }
    }
    if (brfl == true) {
      i--;
      brfl = false;
    }
  }
  return reg_moves;
}

//проверка доступности ударного хода простой шашки:
function beat_move_not_Q_check_en(OurCH, EnCH, checker) {
  var beat_moves = []; //список ударных ходов
  var enemy_check = []; //вспомогательный список полей с потеницальной шашкой оппонента
  var brfl = false; //вспомогательный флаг удаления записи из список
  //изначально записываем все возможные ударные ходы шашки и поля с потеницальной шашкой врага:
  if (checker.color == "white") {
    beat_moves[0] = { horiz: checker.horiz+2, vertic: checker.vertic+2 };
    beat_moves[1] = { horiz: checker.horiz+2, vertic: checker.vertic-2 };
    enemy_check[0] = { horiz: checker.horiz+1, vertic: checker.vertic+1 };
    enemy_check[1] = { horiz: checker.horiz+1, vertic: checker.vertic-1 };
  }
  else if (checker.color == "black") {
    beat_moves[0] = { horiz: checker.horiz-2, vertic: checker.vertic+2 };
    beat_moves[1] = { horiz: checker.horiz-2, vertic: checker.vertic-2 };
    enemy_check[0] = { horiz: checker.horiz-1, vertic: checker.vertic+1 };
    enemy_check[1] = { horiz: checker.horiz-1, vertic: checker.vertic-1 };
  }
  //теперь удалим из списка те ходы, которые ограничены:
  for (var i = 0; i < beat_moves.length; i++) { 
    //сначала проверим на выход за границы игровой доски:
    if ((beat_moves[i].horiz < 1 || beat_moves[i].horiz > 8) || 
      (beat_moves[i].vertic < 1 || beat_moves[i].vertic > 8)) {
        beat_moves.splice(i,1);
        enemy_check.splice(i,1);
        i--;
        continue;
      }
    //потом проверим на то, находится ли на пути шашка оппонента:
    brfl = true;
    for (var j = 0; j < EnCH.length; j++) 
      if (EnCH[j].horiz == enemy_check[i].horiz)
        if (EnCH[j].vertic == enemy_check[i].vertic) {
          //убедимся, что эта шашка не является уже побитой
          if (EnCH[j].isBeaten == false) {
            brfl = false;
            break;
          }
        }
    //после проверим свободно ли поле, на которое перемещается шашка:
    //есть ли в полях союзные шашки?:
    if (brfl == false) {
      for (var j = 0; j < OurCH.length; j++) 
        if (OurCH[j].horiz == beat_moves[i].horiz)
          if (OurCH[j].vertic == beat_moves[i].vertic) {
            brfl = true;
            break;
          }
    }
    //есть ли в полях шашки оппонента?:
    if (brfl == false) {
      for (var j = 0; j < EnCH.length; j++) 
        if (EnCH[j].horiz == beat_moves[i].horiz)
          if (EnCH[j].vertic == beat_moves[i].vertic) {
            brfl = true;
            break;
          }
    }
    if (brfl == true) {
      beat_moves.splice(i,1);
      enemy_check.splice(i,1);
      i--;
      brfl = false;
    }
  }
  //console.log('Potential enemy checkers:', enemy_check);
  return beat_moves;
}

//проверка доступности ударного хода дамки:
function beat_move_Q_check_en(OurCH, EnCH, checker) {
  var beat_moves = []; //список ударных ходов
  var enemy_check = []; //вспомогательный список полей с потеницальной шашкой оппонента
  var brfl = false; //вспомогательный флаг удаления записи из список
  //изначально записываем все возможные ударные ходы шашки и поля с потеницальной шашкой врага:
  beat_moves[0] = { horiz: checker.horiz+2, vertic: checker.vertic+2 };
  beat_moves[1] = { horiz: checker.horiz+2, vertic: checker.vertic-2 };
  beat_moves[2] = { horiz: checker.horiz-2, vertic: checker.vertic+2 };
  beat_moves[3] = { horiz: checker.horiz-2, vertic: checker.vertic-2 };
  enemy_check[0] = { horiz: checker.horiz+1, vertic: checker.vertic+1 };
  enemy_check[1] = { horiz: checker.horiz+1, vertic: checker.vertic-1 };
  enemy_check[2] = { horiz: checker.horiz-1, vertic: checker.vertic+1 };
  enemy_check[3] = { horiz: checker.horiz-1, vertic: checker.vertic-1 };
  //теперь удалим из списка те ходы, которые ограничены:
  for (var i = 0; i < beat_moves.length; i++) { 
    //сначала проверим на выход за границы игровой доски:
    if ((beat_moves[i].horiz < 1 || beat_moves[i].horiz > 8) || 
      (beat_moves[i].vertic < 1 || beat_moves[i].vertic > 8)) {
        beat_moves.splice(i,1);
        enemy_check.splice(i,1);
        i--;
        continue;
      }
    //потом проверим на то, находится ли на пути шашка оппонента:
    brfl = true;
    for (var j = 0; j < EnCH.length; j++) 
      if (EnCH[j].horiz == enemy_check[i].horiz)
        if (EnCH[j].vertic == enemy_check[i].vertic) {
          //убедимся, что эта шашка не является уже побитой
          if (EnCH[j].isBeaten == false) {
            brfl = false;
            break;
          }
        }
    //после проверим свободно ли поле, на которое перемещается шашка:
    //есть ли в полях союзные шашки?:
    if (brfl == false) {
      for (var j = 0; j < OurCH.length; j++) 
        if (OurCH[j].horiz == beat_moves[i].horiz)
          if (OurCH[j].vertic == beat_moves[i].vertic) {
            brfl = true;
            break;
          }
    }
    //есть ли в полях шашки оппонента?:
    if (brfl == false) {
      for (var j = 0; j < EnCH.length; j++) 
        if (EnCH[j].horiz == beat_moves[i].horiz)
          if (EnCH[j].vertic == beat_moves[i].vertic) {
            brfl = true;
            break;
          }
    }
    if (brfl == true) {
      beat_moves.splice(i,1);
      enemy_check.splice(i,1);
      i--;
      brfl = false;
    }
  }
  //console.log('Potential enemy checkers:', enemy_check);
  return beat_moves;
}

//вывод списка шашек с доступным ходом
function checkersCanMove_en(active_Ch, inactive_Ch, BeatFlag) {
  checkersCM = [];
  for (var i = 0; i < active_Ch.length; i++) {
   checkersCM[i] = { horiz: active_Ch[i].horiz, vertic: active_Ch[i].vertic,
                     isQueen: active_Ch[i].isQueen, color: active_Ch[i].color };
  }
   if (BeatFlag == true) {
     for (var i = 0; i < checkersCM.length; i++) {
       if (checkersCM[i].isQueen == true) 
         moves = beat_move_Q_check_en(active_Ch, inactive_Ch, checkersCM[i]);
       else moves = beat_move_not_Q_check_en(active_Ch, inactive_Ch, checkersCM[i]);
       if (moves.length == 0) {
         checkersCM.splice(i,1);
         i--;
       }
     }
   }
   else {
     for (var i = 0; i < checkersCM.length; i++) {
       if (checkersCM[i].isQueen == true) 
         moves = reg_move_Q_check_en(active_Ch, inactive_Ch, checkersCM[i]);
       else moves = reg_move_not_Q_check_en(active_Ch, inactive_Ch, checkersCM[i]);
       if (moves.length == 0) {
         checkersCM.splice(i,1);
         i--;
       }
     }
   }
   return checkersCM;
 }
 

//проверка на то, может ли простая шашка превратится в дамку
function can_turn_Q_check_en(color, movedChecker) {
  var horiz_to_check; //выбирается, какая диагональ будет чекатся
  var Qfl = false; //возвращаемый флаг превращения в дамку
  if (color == "white") horiz_to_check = 8;
  else if (color == "black") horiz_to_check = 1;
  if (movedChecker.horiz == horiz_to_check) Qfl = true;
  return Qfl;
}

//произведение ударного хода
function beating_en(checker, move, enemy_checkers) {
  //начальные и конечные координаты, в пределах которых ищется шашка оппонента
  var h1, h2, v1, v2;
  var c = 0; //вспомогательный счетчик для определения направления
  //сначала зададим конечные координаты для горизонтали и вертикали
  if (checker.horiz > move.new_horiz) {
    h1 = move.new_horiz+1; //h1 всегда нижняя горизонталь
    h2 = checker.horiz-1; //h2 - верхняя
    c++;
  }
  else {
    h1 = checker.horiz+1;
    h2 = move.new_horiz-1;
  }
  if (checker.vertic > move.new_vertic) {
    v1 = move.new_vertic+1; //v1 всегда левая вертикаль
    v2 = checker.vertic-1; //v2 - правая
    c++;
  }
  else {
    v1 = checker.vertic+1;
    v2 = move.new_vertic-1;
  }
  //теперь в цикле будем искать координаты шашки оппонента в пределах этих границ пошагово
  for (var h_comp = h1; h_comp < h2+1; h_comp++) {
    for (var v_comp = v1; v_comp < v2+1; v_comp++) {
      //Оба цикла идут на увеличение, однако в одной из двух диагоналей при увеличении одной
      //координаты, другая уменьшается. С помощью счетчика с проверяется, на какой диагонали 
      //производится ударный ход. При необходимости, направление одной из координаты меняется.
      var vv_comp;
      if (c != 1) vv_comp = v_comp;
      else vv_comp = v2-(v_comp-v1);
      //производится поиск шашки оппонента с заданными координатами
      for (var k = 0; k < enemy_checkers.length; k++) {
        if (enemy_checkers[k].horiz == h_comp)
          if (enemy_checkers[k].vertic == vv_comp) {
            enemy_checkers[k].isBeaten = true; //когда она найдена, ей задается статус "побита"
            return enemy_checkers; //возвращается измененный список всех шашек оппонента
          }
      }
    }
  }
  return 0;
}

//проверка на то, что шашка может нанести еще один ударный ход
function addit_beat_move_check_en(OurCH, EnCH, movedChecker) {
  var bfl = false;
  moves = []; //массив доступных ходов перемещенной шашки
  //проверка на возможность игроком нанести еще один ударный ход
  if (movedChecker.isQueen == true) moves = beat_move_Q_check_en(OurCH, EnCH, movedChecker);
  else moves = beat_move_not_Q_check_en(OurCH, EnCH, movedChecker);
  if (moves.length > 0) bfl = true;
  console.log('Player can make another beat move?:', bfl);
  return moves; //вывод ходов, если они имеются
}


//пост запрос в начале хода для различных проверок
app.post('/en_turn_begin', (req, res) => {
  extractCheckers(req, function(checkers) {
    extractActiveColor(req, function(active_color) {
      active_Ch = []; //массив шашек текущего игрока
      inactive_Ch = []; //массив шашек другого игрока
      moves = []; //массив доступных ходов выбранной шашки
      var statuscode; //статус код, который будет отправлен в ответ к серверу
      var BeatFlag = false; //флаг возможности нанести ударный ход
      //Валидация цвета
      if (active_color == "white") {
        active_Ch = checkers.white; //запись всех элементов с цветом white в первый массив
        inactive_Ch = checkers.black; //black во второй массив
      }
      else if (active_color == "black") {
        active_Ch = checkers.black; //тут все наоборот
        inactive_Ch = checkers.white;
      }
      else {
        statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
        res.status(400).send(statuscode);
        return;
      }
      //проверка на возможность игроком нанести ударный ход
      for (var i = 0; i < active_Ch.length; i++) {
        if (active_Ch[i].isQueen == true) 
          moves = beat_move_Q_check_en(active_Ch, inactive_Ch, active_Ch[i]);
        else moves = beat_move_not_Q_check_en(active_Ch, inactive_Ch, active_Ch[i]);
        if (moves.length > 0) {
          BeatFlag = true;
          break;
        }
      }
      //составление списка шашек которые могут ходить (для бота)
      var checkersWmoves = checkersCanMove_en(active_Ch, inactive_Ch, BeatFlag);
      console.log('Player can make a beat move?:', BeatFlag);
      SetBeatFlag(req, BeatFlag, function(statuscode) {
        if (statuscode) {        
          res.status(200).json(checkersWmoves);
          return;
        }
      })
    })
  })
})

//Пост запрос на вывод списка доступных ходов при пришедших данных о выбранной шашке
app.post('/en_available_moves', (req, res) => {
  extractCheckers(req, function(checkers) {
    var chosen_ch = extractChosenCh(req);
    extractActiveColor(req, function(active_color) {
      extractBeatFlag(req, function(BeatFlag) {
        var active_Ch = []; //массив шашек текущего игрока
        var inactive_Ch = []; //массив шашек другого игрока
        var moves = []; //массив доступных ходов выбранной шашки
        var statuscode; //статус код, который будет отправлен в ответ к серверу
        //Валидация цвета
        if (active_color == "white") {
          active_Ch = checkers.white; //запись всех элементов с цветом white в первый массив
          inactive_Ch = checkers.black; //black во второй массив
        }
        else if (active_color == "black") {
          active_Ch = checkers.black; //тут все наоборот
          inactive_Ch = checkers.white;
        }
        else {
          statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
          res.status(400).send(statuscode);
          return;
        }

        //Составление списка доступных тихих или ударных ходов выбранной шашки:
        if (BeatFlag == true) {
          if (chosen_ch.isQueen == true) moves = beat_move_Q_check_en(active_Ch, inactive_Ch, chosen_ch);
          else moves = beat_move_not_Q_check_en(active_Ch, inactive_Ch, chosen_ch);
        }
        else {
          if (chosen_ch.isQueen == true) moves = reg_move_Q_check_en(active_Ch, inactive_Ch, chosen_ch);
          else moves = reg_move_not_Q_check_en(active_Ch, inactive_Ch, chosen_ch);
        }

        console.log('Available moves of this checker are:\n', moves); //вывод списка ходов в консоль
        res.status(200).json(moves); //отправка списка доступных ходов клиенту
      })
    })
  })
});

//Пост запрос на перемещение выбранной шашки в выбранные координаты
app.post('/en_move', (req, res) => {
  extractCheckers(req, function(checkers) {
    var chosen_ch = extractChosenCh(req);
    var move_ch = extractCheckerMovement(req);
    extractActiveColor(req, function(active_color) {
      extractBeatFlag(req, function(BeatFlag) {
        var active_Ch = []; //массив шашек текущего игрока
        var inactive_Ch = []; //массив шашек другого игрока
        var moves = []; //массив доступных ходов выбранной шашки
        var statuscode; //статус код, который будет отправлен в ответ к серверу
        var comp_flag = false; //флаг выполнения задачи
        //Валидация цвета
        if (active_color == "white") {
          active_Ch = checkers.white; //запись всех элементов с цветом white в первый массив
          inactive_Ch = checkers.black; //black во второй массив
        }
        else if (active_color == "black") {
          active_Ch = checkers.black; //тут все наоборот
          inactive_Ch = checkers.white;
        }
        else {
          statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
          res.status(400).send(statuscode);
          return;
        }

        //Составление списка доступных тихих или ударных ходов выбранной шашки:
        if (BeatFlag == true) {
          if (chosen_ch.isQueen == true) moves = beat_move_Q_check_en(active_Ch, inactive_Ch, chosen_ch);
          else moves = beat_move_not_Q_check_en(active_Ch, inactive_Ch, chosen_ch);
        }
        else {
          if (chosen_ch.isQueen == true) moves = reg_move_Q_check_en(active_Ch, inactive_Ch, chosen_ch);
          else moves = reg_move_not_Q_check_en(active_Ch, inactive_Ch, chosen_ch);
        }

        //Ищем шашку и меняем параметры
        for (var i = 0; i < active_Ch.length; i++) {
          if (active_Ch[i].horiz == chosen_ch.horiz)
            if (active_Ch[i].vertic == chosen_ch.vertic) 
            {
              //Функция валидации хода
              var valid_move = false; //false - ход запрещен, true - ход разрешен
              for (var j = 0; j < moves.length; j++)
                if (moves[j].horiz == move_ch.new_horiz)
                  if (moves[j].vertic == move_ch.new_vertic)
                  valid_move = true;
              if (valid_move == true) {
                //если валидация пройдена, то шашка перемещается на новые координаты:
                active_Ch[i].horiz = move_ch.new_horiz;
                active_Ch[i].vertic = move_ch.new_vertic;
                //проверка на то, дошла или шашка до последней горизонтали
                var Qfl = false; //изначальный флаг превращения в дамку
                //при этом предварительно проверяется, является ли уже шашка дамкой
                if (active_Ch[i].isQueen == false)
                  //если нет, то проверка активируется
                  Qfl = can_turn_Q_check_en(active_Ch[i].color, active_Ch[i]);
                //если флаг активировался, то шашка превращается в дамку
                if (Qfl) active_Ch[i].isQueen = true;
                //console.log('Parameters of moved checker:', JSON.stringify(movedChecker));
                //если это ударный ход, то шашка оппонента становится побитой
                if (BeatFlag == true)
                  inactive_Ch = beating_en(chosen_ch, move_ch, inactive_Ch);
                //console.log('Enemy checkers after beating move:', inactive_Ch);
                //составим данные о перемещенной шашке, чтобы отправить ее клиенту
                var movedChecker = JSON.parse(JSON.stringify(
                          {"color": active_Ch[i].color, "horiz": active_Ch[i].horiz, 
                          "vertic": active_Ch[i].vertic, "isQueen": active_Ch[i].isQueen,
                          "turnedQueen": Qfl}
                          ));
                comp_flag = true;
                UpdateCheckersField(req, checkers, chosen_ch, movedChecker, function(statuscode) {
                  console.log('List of all checkers after move:', JSON.stringify(checkers));
                  if (statuscode)
                    res.status(200).json(movedChecker);
                  return;
                })
              }
              else {
                //Вернуть статус-код ошибки выбора новых координат
                statuscode = ({ status: "error: this move is not valid" });
                res.status(400).send(statuscode);
                return;
              }
            }
        }
        if (!comp_flag) {
          //Вернуть статус-код ошибки выполнения задачи
          statuscode = ({ status: "error: no such checker" });
          res.status(400).send(statuscode);
        }
      })
    })
  })
});

//Пост запрос на выполнение ряда действий после совершения хода игроком
app.post('/en_after_move', (req, res) => {
  extractCheckers(req, function(checkers) {
    var movedChecker = extractChosenCh(req); //данные о перемещенной шашке
    var turnedQueen = req.body.turnedQueen; //превратилась ли она в дамку
    extractActiveColor(req, function(active_color) {
      extractBeatFlag(req, function(BeatFlag) {
        var active_Ch = []; //массив шашек текущего игрока
        var inactive_Ch = []; //массив шашек другого игрока
        var addit_moves = []; //массив доступных ходов выбранной шашки
        var statuscode; //статус код, который будет отправлен в ответ к серверу
        //Валидация цвета
        if (active_color == "white") {
          active_Ch = checkers.white; //запись всех элементов с цветом white в первый массив
          inactive_Ch = checkers.black; //black во второй массив
        }
        else if (active_color == "black") {
          active_Ch = checkers.black; //тут все наоборот
          inactive_Ch = checkers.white;
        }
        else {
          statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
          res.status(400).send(statuscode);
          return;
        }
        //Проверим, какое дальше действие должно произойти
        //Если ход был ударный, то...
        if (BeatFlag == true) {
          //Далее предпринимается попытка составить список следующих ударных ходов
          addit_moves = addit_beat_move_check_en(active_Ch, inactive_Ch, movedChecker);
          //Если доп ходы нашлись, а сама шашка не превратилась в дамку,
          //то список этих доп ходов отправляется игроку
          if (addit_moves.length > 0 && turnedQueen == false) {
            console.log('Additional available moves of this checker are:\n', addit_moves);
            res.status(200).json(addit_moves); //отправка списка доступных ходов клиенту
          }
          //В ином же случае ход игрока завершается
          else {
            //Удалим все съеденные шашки оппонента
            for (var i = 0; i < inactive_Ch.length; i++) { 
              if (inactive_Ch[i].isBeaten == true) {
                  inactive_Ch.splice(i,1);
                  i--;
                }
            }
            //Если шашек оппонента больше нет, то игра завершается
            if (inactive_Ch.length == 0) {
              SetWinnerColor(req, active_color, function(statuscode) {
                console.log(`End of the game!${active_color} has won!`);
                res.status(200).send(statuscode);
                return;
              })
            }
            //Если же еще остались, то завершается ход
            else {      
              SetActiveColor(req, inactive_Ch[0].color, function(statuscode) {
                if (statuscode) {
                  var ph = []; ph.horiz = 0; ph.vertic = 0;
                  UpdateCheckersField(req, checkers, ph, ph, function(statuscode) {
                    console.log('List of all checkers after end of turn:', JSON.stringify(checkers));
                    console.log('End of turn');
                    res.status(200).send(statuscode);
                    return;
                  })
                }
              })
            }
          }
        }
        //Если же ход был простой, то он сразу же завершается
        else {
          SetActiveColor(req, inactive_Ch[0].color, function(statuscode) {
            console.log('End of turn');
            res.status(200).send(statuscode);
            return;
          })
        }
      })
    })
  })
});

//------------------ТУРЕЦКИЕ ШАШКИ------------------------

//набор функций, которые будут использоваться для различных проверок:
//проверка доступности тихого хода простой шашки:
function reg_move_not_Q_check_tu(OurCH, EnCH, checker) {
  var reg_moves = []; //список тихих ходов
  var brfl = false; //вспомогательный флаг удаления записи из список
  //изначально записываем все возможные тихие ходы шашки:
  if (checker.color == "white") {
    reg_moves[0] = { horiz: checker.horiz+1, vertic: checker.vertic };
    reg_moves[1] = { horiz: checker.horiz, vertic: checker.vertic-1 };
    reg_moves[2] = { horiz: checker.horiz, vertic: checker.vertic+1 };
  }
  else 
  if (checker.color == "black") {
    reg_moves[0] = { horiz: checker.horiz-1, vertic: checker.vertic };
    reg_moves[1] = { horiz: checker.horiz, vertic: checker.vertic-1 };
    reg_moves[2] = { horiz: checker.horiz, vertic: checker.vertic+1 };
  }
  //теперь удалим из списка те ходы, которые ограничены:
  for (var i = 0; i < reg_moves.length; i++) { 
    //сначала проверим на выход за границы игровой доски:
    if ((reg_moves[i].horiz < 1 || reg_moves[i].horiz > 8) || 
      (reg_moves[i].vertic < 1 || reg_moves[i].vertic > 8)) {
        reg_moves.splice(i,1);
        i--;
        continue;
      }
    //потом проверим свободно ли поле, на которое перемещается шашка:
    //есть ли в полях союзные шашки?:
    for (var j = 0; j < OurCH.length; j++)
      if (OurCH[j].horiz == reg_moves[i].horiz)
        if (OurCH[j].vertic == reg_moves[i].vertic) {
          reg_moves.splice(i,1);
          brfl = true;
          break;
        }
    //есть ли в полях шашки оппонента?:
    if (brfl == false) {
      for (var j = 0; j < EnCH.length; j++)
        if (EnCH[j].horiz == reg_moves[i].horiz)
          if (EnCH[j].vertic == reg_moves[i].vertic) {
            reg_moves.splice(i,1);
            brfl = true;
            break;
          }
    }
    if (brfl == true) {
      i--;
      brfl = false;
    }
  }
  return reg_moves;
}

//проверка доступности тихого хода дамки:
function reg_move_Q_check_tu(OurCH, EnCH, checker) {
  var reg_moves = []; //список тихих ходов
  var brfl = false; //вспомогательный флаг прерывания записи в список
  var count = 0; //номер в списке ходов
  //будем искать тихие ходы во всех 4 направлениях:
  //вниз:
  for (var k = 0; k < 8; k++) { //будем считать до 8, так как это максимум на доске
    //сначала посмотрим, является ли поле занято другой шашкой
    for (var j = 0; j < OurCH.length; j++) {
      var h = checker.horiz-(k+1);
      var v = checker.vertic;
      if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
        brfl = true; //если да, то поиск прекращается в этом направлении
        break;
      }
    }
    for (var j = 0; j < EnCH.length; j++) {
      var h = checker.horiz-(k+1);
      var v = checker.vertic;
      if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    //так же проверяется, не вышла ли проверка за границы игровой доски
    if (h < 1 || brfl == true) {
      brfl = false;
      break;
    }
    //если ни одно из условий не нарушено, то поле записывается в список
    reg_moves[count] = { horiz: h, vertic: v };
    count++;
  }
  //вправо:
  for (var k = 0; k < 8; k++) {
    for (var j = 0; j < OurCH.length; j++) {
      var h = checker.horiz;
      var v = checker.vertic+(k+1);
      if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    for (var j = 0; j < EnCH.length; j++) {
      var h = checker.horiz;
      var v = checker.vertic+(k+1);
      if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    if (v > 8 || brfl == true) {
      brfl = false;
      break;
    }
    reg_moves[count] = { horiz: h, vertic: v };
    count++;
  }
  //вверх:
  for (var k = 0; k < 8; k++) {
    for (var j = 0; j < OurCH.length; j++) {
      var h = checker.horiz+(k+1);
      var v = checker.vertic;
      if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    for (var j = 0; j < EnCH.length; j++) {
      var h = checker.horiz+(k+1);
      var v = checker.vertic;
      if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    if (h > 8 || brfl == true) {
      brfl = false;
      break;
    }
    reg_moves[count] = { horiz: h, vertic: v };
    count++;
  }
  //влево:
  for (var k = 0; k < 8; k++) {
    for (var j = 0; j < OurCH.length; j++) {
      var h = checker.horiz;
      var v = checker.vertic-(k+1);
      if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    for (var j = 0; j < EnCH.length; j++) {
      var h = checker.horiz;
      var v = checker.vertic-(k+1);
      if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
        brfl = true;
        break;
      }
    }
    if (v < 1 || brfl == true) {
      brfl = false;
      break;
    }
    reg_moves[count] = { horiz: h, vertic: v };
    count++;
  }
  return reg_moves;
}

//проверка доступности ударного хода простой шашки:
function beat_move_not_Q_check_tu(OurCH, EnCH, checker) {
  var beat_moves = []; //список ударных ходов
  var enemy_check = []; //вспомогательный список полей с потеницальной шашкой оппонента
  var brfl = false; //вспомогательный флаг удаления записи из список
  //изначально записываем все возможные ударные ходы шашки и поля с потеницальной шашкой врага:
  if (checker.color == "white") {
    beat_moves[0] = { horiz: checker.horiz+2, vertic: checker.vertic };
    beat_moves[1] = { horiz: checker.horiz, vertic: checker.vertic+2 };
    beat_moves[2] = { horiz: checker.horiz, vertic: checker.vertic-2 };
    enemy_check[0] = { horiz: checker.horiz+1, vertic: checker.vertic };
    enemy_check[1] = { horiz: checker.horiz, vertic: checker.vertic+1 };
    enemy_check[2] = { horiz: checker.horiz, vertic: checker.vertic-1 };
  }
  else if (checker.color == "black") {
    beat_moves[0] = { horiz: checker.horiz-2, vertic: checker.vertic };
    beat_moves[1] = { horiz: checker.horiz, vertic: checker.vertic+2 };
    beat_moves[2] = { horiz: checker.horiz, vertic: checker.vertic-2 };
    enemy_check[0] = { horiz: checker.horiz-1, vertic: checker.vertic };
    enemy_check[1] = { horiz: checker.horiz, vertic: checker.vertic+1 };
    enemy_check[2] = { horiz: checker.horiz, vertic: checker.vertic-1 };
  }
  //теперь удалим из списка те ходы, которые ограничены:
  for (var i = 0; i < beat_moves.length; i++) { 
    //сначала проверим на выход за границы игровой доски:
    if ((beat_moves[i].horiz < 1 || beat_moves[i].horiz > 8) || 
      (beat_moves[i].vertic < 1 || beat_moves[i].vertic > 8)) {
        beat_moves.splice(i,1);
        enemy_check.splice(i,1);
        i--;
        continue;
      }
    //потом проверим на то, находится ли на пути шашка оппонента:
    brfl = true;
    for (var j = 0; j < EnCH.length; j++) 
      if (EnCH[j].horiz == enemy_check[i].horiz)
        if (EnCH[j].vertic == enemy_check[i].vertic) {
          brfl = false;
          break;
        }
    //после проверим свободно ли поле, на которое перемещается шашка:
    //есть ли в полях союзные шашки?:
    if (brfl == false) {
      for (var j = 0; j < OurCH.length; j++) 
        if (OurCH[j].horiz == beat_moves[i].horiz)
          if (OurCH[j].vertic == beat_moves[i].vertic) {
            brfl = true;
            break;
          }
    }
    //есть ли в полях шашки оппонента?:
    if (brfl == false) {
      for (var j = 0; j < EnCH.length; j++) 
        if (EnCH[j].horiz == beat_moves[i].horiz)
          if (EnCH[j].vertic == beat_moves[i].vertic) {
            brfl = true;
            break;
          }
    }
    if (brfl == true) {
      beat_moves.splice(i,1);
      enemy_check.splice(i,1);
      i--;
      brfl = false;
    }
  }
  //console.log('Potential enemy checkers:', enemy_check);
  return beat_moves;
}

//проверка доступности ударного хода дамки:
function beat_move_Q_check_tu(OurCH, EnCH, checker, forb_dir) {
  var beat_moves = []; //список ударных ходов
  var enemy_check = []; //вспомогательный список полей с шашкой оппонента
  var brfl = false; //вспомогательный флаг прерывания записи в список
  var enfl = false; //флаг нахождения шашки оппонента
  var count = 0; //номер в списке ходов
  var countEn = 0; //номер в списке полей с шашкой оппонента
  //будем искать ударные ходы во всех 4 направлениях:
  //вниз:
  for (var k = 0; k < 8; k++) { //будем считать до 8, так как это максимум на доске
    //разделим проверку на 2 части:
    //1) проверка свободных полей ДО шашки оппонента
    if (enfl == false){
      //сначала посмотрим, является ли поле занято шашкой ОППОНЕНТА
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz-(k+1);
        var v = checker.vertic;
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          //сначала убедимся, что это направление допустимо
          if(forb_dir == 0) {
            brfl = true; //если нет, то поиск прекращается в этом направлении
            break;
          }
          //в ином же случае шашка оппонента является потеницально подходящей
          enfl = true; //активируется флаг нахождения шашки оппонента
          //в список записывается поле с шашкой оппонента
          enemy_check[countEn] = { horiz: h, vertic: v };
          countEn++;
          break;
        }
      }
      //потом проверим, а не занято ли поле нашей шашкой, что уже является препядствием
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz-(k+1);
        var v = checker.vertic;
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true; //если да, то поиск прекращается в этом направлении
          break;
        }
      }
      //так же проверяется, не вышла ли проверка за границы игровой доски
      if (h < 1 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
    }
    //2) проверка свободных полей ПОСЛЕ шашки оппонента
    else {
      //сначала посмотрим, является ли поле занято другой шашкой
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz-(k+1);
        var v = checker.vertic;
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true; //если да, то поиск прекращается в этом направлении
          break;
        }
      }
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz-(k+1);
        var v = checker.vertic;
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      //так же проверяется, не вышла ли проверка за границы игровой доски
      if (h < 1 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
      //если ни одно из условий не нарушено, то поле записывается в список
      beat_moves[count] = { horiz: h, vertic: v };
      count++;
    }   
  }
  //вправо:
  for (var k = 0; k < 8; k++) {
    if (enfl == false) {
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz;
        var v = checker.vertic+(k+1);
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          if(forb_dir == 1) {
            brfl = true;
            break;
          }
          enfl = true;
          enemy_check[countEn] = { horiz: h, vertic: v };
          countEn++;
          break;
        }
      }
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz;
        var v = checker.vertic+(k+1);
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      if (v > 8 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
    }
    else {
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz;
        var v = checker.vertic+(k+1);
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz;
        var v = checker.vertic+(k+1);
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      if (v > 8 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
      beat_moves[count] = { horiz: h, vertic: v };
      count++;
    }
  }
  //вверх:
  for (var k = 0; k < 8; k++) {
    if (enfl == false) {
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz+(k+1);
        var v = checker.vertic;
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          if(forb_dir == 2) {
            brfl = true;
            break;
          }
          enfl = true;
          enemy_check[countEn] = { horiz: h, vertic: v };
          countEn++;
          break;
        }
      }
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz+(k+1);
        var v = checker.vertic;
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      if (h > 8 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
    }
    else {
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz+(k+1);
        var v = checker.vertic;
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz+(k+1);
        var v = checker.vertic;
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      if (h > 8 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
      beat_moves[count] = { horiz: h, vertic: v };
      count++;
    }
  }
  //влево:
  for (var k = 0; k < 8; k++) {
    if (enfl == false) {
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz;
        var v = checker.vertic-(k+1);
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          if(forb_dir == 3) {
            brfl = true;
            break;
          }
          enfl = true;
          enemy_check[countEn] = { horiz: h, vertic: v };
          countEn++;
          break;
        }
      }
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz;
        var v = checker.vertic-(k+1);
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      if (v < 1 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
    }
    else {
      for (var j = 0; j < OurCH.length; j++) {
        var h = checker.horiz;
        var v = checker.vertic-(k+1);
        if (OurCH[j].horiz == h && OurCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      for (var j = 0; j < EnCH.length; j++) {
        var h = checker.horiz;
        var v = checker.vertic-(k+1);
        if (EnCH[j].horiz == h && EnCH[j].vertic == v) {
          brfl = true;
          break;
        }
      }
      if (v < 1 || brfl == true) {
        brfl = false;
        enfl = false;
        break;
      }
      beat_moves[count] = { horiz: h, vertic: v };
      count++;
    }
  }
  //console.log('Potential enemy checkers:', enemy_check);
  return beat_moves;
}

//вывод списка шашек с доступным ходом
function checkersCanMove_tu(active_Ch, inactive_Ch, BeatFlag) {
  checkersCM = [];
  for (var i = 0; i < active_Ch.length; i++) {
   checkersCM[i] = { horiz: active_Ch[i].horiz, vertic: active_Ch[i].vertic,
                     isQueen: active_Ch[i].isQueen, color: active_Ch[i].color };
  }
   if (BeatFlag == true) {
     for (var i = 0; i < checkersCM.length; i++) {
       if (checkersCM[i].isQueen == true) 
         moves = beat_move_Q_check_tu(active_Ch, inactive_Ch, checkersCM[i]);
       else moves = beat_move_not_Q_check_tu(active_Ch, inactive_Ch, checkersCM[i]);
       if (moves.length == 0) {
         checkersCM.splice(i,1);
         i--;
       }
     }
   }
   else {
     for (var i = 0; i < checkersCM.length; i++) {
       if (checkersCM[i].isQueen == true) 
         moves = reg_move_Q_check_tu(active_Ch, inactive_Ch, checkersCM[i]);
       else moves = reg_move_not_Q_check_tu(active_Ch, inactive_Ch, checkersCM[i]);
       if (moves.length == 0) {
         checkersCM.splice(i,1);
         i--;
       }
     }
   }
   return checkersCM;
 }

//проверка на то, может ли простая шашка превратится в дамку
function can_turn_Q_check_tu(color, movedChecker) {
  var horiz_to_check; //выбирается, какая диагональ будет чекатся
  var Qfl = false; //возвращаемый флаг превращения в дамку
  if (color == "white") horiz_to_check = 8;
  else if (color == "black") horiz_to_check = 1;
  if (movedChecker.horiz == horiz_to_check) Qfl = true;
  return Qfl;
}

//произведение ударного хода
function beating_tu(checker, move, enemy_checkers) {
  //начальные и конечные координаты, в пределах которых ищется шашка оппонента:
  var h1, h2, v1, v2;
  //движение, противоположное направлению движения шашки:
  var opp_direction; //0 - вниз, 1 - вправо, 2 - вверх, 3 - влево
  var const_horiz; //вспомогательное значение для определения направления
  //сначала зададим конечные координаты для горизонтали и вертикали
  if (checker.horiz == move.new_horiz) 
    const_horiz = true;
  else if (checker.horiz > move.new_horiz) { //вниз
    h1 = move.new_horiz+1; //h1 всегда нижняя горизонталь
    h2 = checker.horiz-1; //h2 - верхняя
    opp_direction = 2;
  }
  else { //вверх
    h1 = checker.horiz+1;
    h2 = move.new_horiz-1;
    opp_direction = 0;
  }
  if (checker.vertic == move.new_vertic) 
    const_horiz = false;
  if (checker.vertic > move.new_vertic) { //влево
    v1 = move.new_vertic+1; //v1 всегда левая вертикаль
    v2 = checker.vertic-1; //v2 - правая
    opp_direction = 1;
  }
  else { //вправо
    v1 = checker.vertic+1;
    v2 = move.new_vertic-1;
    opp_direction = 3;
  }
  //определим направление узнав, меняется ли значение горизонтали
  if (const_horiz == false) {
    //если да, то значит шашка переместилась по вертикали
    var v_comp = checker.vertic;
    for (var h_comp = h1; h_comp < h2+1; h_comp++) {
      //производится поиск шашки оппонента с заданными координатами
      for (var k = 0; k < enemy_checkers.length; k++) {
        if (enemy_checkers[k].horiz == h_comp)
          if (enemy_checkers[k].vertic == v_comp) {
            //когда она найдена, она удаляется из списка шашек:
            enemy_checkers.splice(k,1);
            //возвращается измененный список всех шашек оппонента:
            return [enemy_checkers, opp_direction]; 
          }
      }
    }
  }
  else {
    //если же нет, значит шашка перемещалась по этой горизонтали
    var h_comp = checker.horiz;
    for (var v_comp = v1; v_comp < v2+1; v_comp++) {
      //производится поиск шашки оппонента с заданными координатами
      for (var k = 0; k < enemy_checkers.length; k++) {
        if (enemy_checkers[k].horiz == h_comp)
          if (enemy_checkers[k].vertic == v_comp) {
            //когда она найдена, она удаляется из списка шашек:
            enemy_checkers.splice(k,1);
            //возвращается измененный список всех шашек оппонента:
            return [enemy_checkers, opp_direction]; 
          }
      }
    }
  }
  return 0;
}

//проверка на то, что шашка может нанести еще один ударный ход
function addit_beat_move_check_tu(OurCH, EnCH, movedChecker, forb_dir) {
  var bfl = false;
  moves = []; //массив доступных ходов перемещенной шашки
  //проверка на возможность игроком нанести еще один ударный ход
  if (movedChecker.isQueen == true) 
    moves = beat_move_Q_check_tu(OurCH, EnCH, movedChecker, forb_dir);
  else moves = beat_move_not_Q_check_tu(OurCH, EnCH, movedChecker);
  if (moves.length > 0) bfl = true;
  console.log('Player can make another beat move?:', bfl);
  return moves; //вывод ходов, если они имеются
}


//пост запрос в начале хода для различных проверок
app.post('/tu_turn_begin', (req, res) => {
  extractCheckers(req, function(checkers) {
    extractActiveColor(req, function(active_color) {
      active_Ch = []; //массив шашек текущего игрока
      inactive_Ch = []; //массив шашек другого игрока
      moves = []; //массив доступных ходов выбранной шашки
      var statuscode; //статус код, который будет отправлен в ответ к серверу
      var BeatFlag = false; //флаг возможности нанести ударный ход
      //Валидация цвета
      if (active_color == "white") {
        active_Ch = checkers.white; //запись всех элементов с цветом white в первый массив
        inactive_Ch = checkers.black; //black во второй массив
      }
      else if (active_color == "black") {
        active_Ch = checkers.black; //тут все наоборот
        inactive_Ch = checkers.white;
      }
      else {
        statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
        res.status(400).send(statuscode);
        return;
      }
      //проверка на возможность игроком нанести ударный ход
      for (var i = 0; i < active_Ch.length; i++) {
        if (active_Ch[i].isQueen == true) 
          moves = beat_move_Q_check_tu(active_Ch, inactive_Ch, active_Ch[i]);
        else moves = beat_move_not_Q_check_tu(active_Ch, inactive_Ch, active_Ch[i]);
        if (moves.length > 0) {
          BeatFlag = true;
          break;
        }
      }
      //составление списка шашек которые могут ходить (для бота)
      var checkersWmoves = checkersCanMove_tu(active_Ch, inactive_Ch, BeatFlag);
      console.log('Player can make a beat move?:', BeatFlag);
      SetBeatFlag(req, BeatFlag, function(statuscode) {
        if (statuscode) {        
          res.status(200).json(checkersWmoves);
          return;
        }
      })
    })
  })
})

//Пост запрос на вывод списка доступных ходов при пришедших данных о выбранной шашке
app.post('/tu_available_moves', (req, res) => {
  extractCheckers(req, function(checkers) {
    var chosen_ch = extractChosenCh(req);
    extractActiveColor(req, function(active_color) {
      extractBeatFlag(req, function(BeatFlag) {
        var active_Ch = []; //массив шашек текущего игрока
        var inactive_Ch = []; //массив шашек другого игрока
        var moves = []; //массив доступных ходов выбранной шашки
        var statuscode; //статус код, который будет отправлен в ответ к серверу
        //Валидация цвета
        if (active_color == "white") {
          active_Ch = checkers.white; //запись всех элементов с цветом white в первый массив
          inactive_Ch = checkers.black; //black во второй массив
        }
        else if (active_color == "black") {
          active_Ch = checkers.black; //тут все наоборот
          inactive_Ch = checkers.white;
        }
        else {
          statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
          res.status(400).send(statuscode);
          return;
        }

        //Составление списка доступных тихих или ударных ходов выбранной шашки:
        if (BeatFlag == true) {
          if (chosen_ch.isQueen == true) moves = beat_move_Q_check_tu(active_Ch, inactive_Ch, chosen_ch);
          else moves = beat_move_not_Q_check_tu(active_Ch, inactive_Ch, chosen_ch);
        }
        else {
          if (chosen_ch.isQueen == true) moves = reg_move_Q_check_tu(active_Ch, inactive_Ch, chosen_ch);
          else moves = reg_move_not_Q_check_tu(active_Ch, inactive_Ch, chosen_ch);
        }

        console.log('Available moves of this checker are:\n', moves); //вывод списка ходов в консоль
        res.status(200).json(moves); //отправка списка доступных ходов клиенту
      })
    })
  })
});

//Пост запрос на перемещение выбранной шашки в выбранные координаты
app.post('/tu_move', (req, res) => {
  extractCheckers(req, function(checkers) {
    var chosen_ch = extractChosenCh(req);
    var move_ch = extractCheckerMovement(req);
    extractActiveColor(req, function(active_color) {
      extractBeatFlag(req, function(BeatFlag) {
        var active_Ch = []; //массив шашек текущего игрока
        var inactive_Ch = []; //массив шашек другого игрока
        var moves = []; //массив доступных ходов выбранной шашки
        var statuscode; //статус код, который будет отправлен в ответ к серверу
        var comp_flag = false; //флаг выполнения задачи
        //Валидация цвета
        if (active_color == "white") {
          active_Ch = checkers.white; //запись всех элементов с цветом white в первый массив
          inactive_Ch = checkers.black; //black во второй массив
        }
        else if (active_color == "black") {
          active_Ch = checkers.black; //тут все наоборот
          inactive_Ch = checkers.white;
        }
        else {
          statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
          res.status(400).send(statuscode);
          return;
        }

        //Составление списка доступных тихих или ударных ходов выбранной шашки:
        if (BeatFlag == true) {
          if (chosen_ch.isQueen == true) moves = beat_move_Q_check_tu(active_Ch, inactive_Ch, chosen_ch);
          else moves = beat_move_not_Q_check_tu(active_Ch, inactive_Ch, chosen_ch);
        }
        else {
          if (chosen_ch.isQueen == true) moves = reg_move_Q_check_tu(active_Ch, inactive_Ch, chosen_ch);
          else moves = reg_move_not_Q_check_tu(active_Ch, inactive_Ch, chosen_ch);
        }

        //Ищем шашку и меняем параметры
        for (var i = 0; i < active_Ch.length; i++) {
          if (active_Ch[i].horiz == chosen_ch.horiz)
            if (active_Ch[i].vertic == chosen_ch.vertic) 
            {
              //Функция валидации хода
              var valid_move = false; //false - ход запрещен, true - ход разрешен
              for (var j = 0; j < moves.length; j++)
                if (moves[j].horiz == move_ch.new_horiz)
                  if (moves[j].vertic == move_ch.new_vertic)
                  valid_move = true;
              if (valid_move == true) {
                //если валидация пройдена, то шашка перемещается на новые координаты:
                active_Ch[i].horiz = move_ch.new_horiz;
                active_Ch[i].vertic = move_ch.new_vertic;
                //проверка на то, дошла или шашка до последней горизонтали
                var Qfl = false; //изначальный флаг превращения в дамку
                //при этом предварительно проверяется, является ли уже шашка дамкой
                if (active_Ch[i].isQueen == false)
                  //если нет, то проверка активируется
                  Qfl = can_turn_Q_check_tu(active_Ch[i].color, active_Ch[i]);
                //если флаг активировался, то шашка превращается в дамку в конце всего хода 
                //console.log('Parameters of moved checker:', JSON.stringify(movedChecker));
                //если это ударный ход, то шашка оппонента сразу же покидает поле
                //при это вычисляется противоположное движение шашки
                var opp_direction;
                if (BeatFlag == true)
                  [inactive_Ch, opp_direction] = beating_tu(chosen_ch, move_ch, inactive_Ch);
                //console.log('Enemy checkers after beating move:', inactive_Ch);
                //составим данные о перемещенной шашке, чтобы отправить ее клиенту
                var movedChecker = JSON.parse(JSON.stringify(
                          {"color": active_Ch[i].color, "horiz": active_Ch[i].horiz, 
                          "vertic": active_Ch[i].vertic, "isQueen": active_Ch[i].isQueen,
                          "turnedQueen": Qfl, "forbidden_direction": opp_direction}
                          ));
                comp_flag = true;
                UpdateCheckersField(req, checkers, chosen_ch, movedChecker, function(statuscode) {
                  console.log('List of all checkers after move:', JSON.stringify(checkers));
                  if (statuscode)
                    res.status(200).json(movedChecker);
                  return;
                })
              }
              else {
                //Вернуть статус-код ошибки выбора новых координат
                statuscode = ({ status: "error: this move is not valid" });
                res.status(400).send(statuscode);
                return;
              }
            }
        }
        if (!comp_flag) {
          //Вернуть статус-код ошибки выполнения задачи
          statuscode = ({ status: "error: no such checker" });
          res.status(400).send(statuscode);
        }
      })
    })
  })
});

//Пост запрос на выполнение ряда действий после совершения хода игроком
app.post('/tu_after_move', (req, res) => {
  extractCheckers(req, function(checkers) {
    var movedChecker = extractChosenCh(req); //данные о перемещенной шашке
    var turnedQueen = req.body.turnedQueen; //превратилась ли она в дамку
    //запрещенное направление:
    //0 - вниз, 1 - вправо, 2 - вверх, 3 - влево
    var forb_dir = req.body.forbidden_direction; 
    extractActiveColor(req, function(active_color) {
      extractBeatFlag(req, function(BeatFlag) {
        var active_Ch = []; //массив шашек текущего игрока
        var inactive_Ch = []; //массив шашек другого игрока
        var addit_moves = []; //массив доступных ходов выбранной шашки
        var statuscode; //статус код, который будет отправлен в ответ к серверу
        //Валидация цвета
        if (active_color == "white") {
          //запись всех элементов с цветом white в первый массив:
          active_Ch = checkers.white; 
          inactive_Ch = checkers.black; //black во второй массив
        }
        else if (active_color == "black") {
          active_Ch = checkers.black; //тут все наоборот
          inactive_Ch = checkers.white;
        }
        else {
          //вывод ошибки если цвет неправильный
          statuscode = { status: "error: no such color" };
          res.status(400).send(statuscode);
          return;
        }
        //Проверим, какое дальше действие должно произойти
        //Если ход был ударный, то...
        if (BeatFlag == true) {
          //Далее предпринимается попытка составить список следующих ударных ходов
          addit_moves = addit_beat_move_check_tu(active_Ch, inactive_Ch, 
            movedChecker, forb_dir);
          //Если доп ходы нашлись, то список этих доп ходов отправляется игроку
          if (addit_moves.length > 0) {
            console.log('Additional available moves of this checker are:\n', 
            addit_moves);
            //отправка списка доступных ходов клиенту:
            res.status(200).json(addit_moves); 
          }
          //В ином же случае ход игрока завершается
          else {
            //Если шашка получила флаг превращения в дамку, то она наконец превращается
            if (turnedQueen) {
              for (var j = 0; j < active_Ch.length; j++)
                if (active_Ch[j].horiz == movedChecker.horiz)
                  if (active_Ch[j].vertic == movedChecker.vertic)
                    active_Ch[j].isQueen == true;
            }
            //Если шашек оппонента больше нет, то игра завершается
            if (inactive_Ch.length == 0) {
              SetWinnerColor(req, active_color, function(statuscode) {
                console.log(`End of the game!${active_color} has won!`);
                res.status(200).send(statuscode);
                return;
              })
            }
            //Если же еще остались, то завершается ход
            else {      
              SetActiveColor(req, inactive_Ch[0].color, function(statuscode) {
                if (statuscode) {
                  var ph = []; ph.horiz = 0; ph.vertic = 0;
                  UpdateCheckersField(req, checkers, ph, ph, function(statuscode) {
                    console.log('List of all checkers after end of turn:', 
                    JSON.stringify(checkers));
                    console.log('End of turn');
                    res.status(200).send(statuscode);
                    return;
                  })
                }
              })
            }
          }
        }
        //Если же ход был простой, то он сразу же завершается
        else {
          //Если шашка получила флаг превращения в дамку, то она превращается
          if (turnedQueen) {
            for (var j = 0; j < active_Ch.length; j++)
              if (active_Ch[j].horiz == movedChecker.horiz)
                if (active_Ch[j].vertic == movedChecker.vertic)
                  active_Ch[j].isQueen == true;
          }
          SetActiveColor(req, inactive_Ch[0].color, function(statuscode) {
            if (statuscode) {
              var ph = []; ph.horiz = 0; ph.vertic = 0;
              UpdateCheckersField(req, checkers, ph, ph, function(statuscode) {
                console.log('List of all checkers after end of turn:', 
                JSON.stringify(checkers));
                console.log('End of turn');
                res.status(200).send(statuscode);
                return;
              })
            }
          })
        }
      })
    })
  })
});

app.listen(port, () => { //клиент запущен
  console.log(`Client active on port ${port}`);
})
