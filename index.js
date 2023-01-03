const e = require('express');
const express = require('express'); //подключение нужных библиотек
const XMLHttpRequest = require('xhr2');

const hostname = '127.0.0.1'; //хост
const port = 4000; //номер порта клиента
var checkers; //json пришедший с сервера
var BeatFlag = false; //флаг возможности нанести ударный ход
var chosen_ch; //json с выбранной шашкей
var move_ch; //json с координатами перемещения
var color_chCh, h_chCh, v_chCh, isQ_chCh, canB_chCh; //параметры выбранной шашки
var new_h_Ch, new_v_Ch; //координаты перемещения
var checkers_ch; //измененный json всех шашек
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
      new_h_Ch = move_ch.horiz;
      new_v_Ch = move_ch.vertic;
      console.log('New coordinates are:', new_h_Ch, new_v_Ch);
    }
    else {
      console.log('2'); //вывод в консоль
      res.status(400).send({ status: "new coordinates are not chosen" });  //статус код не пришел
      return;
    }  
  }
});

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
    for (var j = 0; j < EnCH.length; j++)
      if (EnCH[j].horiz == reg_moves[i].horiz)
        if (EnCH[j].vertic == reg_moves[i].vertic) {
          reg_moves.splice(i,1);
          brfl = true;
          break;
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
  if (checker.color == "white") {
    beat_moves[0] = { horiz: checker.horiz+2, vertic: checker.vertic+2 };
    beat_moves[1] = { horiz: checker.horiz+2, vertic: checker.vertic-2 };
    enemy_check[0] = { horiz: checker.horiz+1, vertic: checker.vertic+1 };
    enemy_check[1] = { horiz: checker.horiz+1, vertic: checker.vertic-1 };
  }
  else 
  if (checker.color == "black") {
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
    for (var j = 0; j < OurCH.length; j++) 
      if (OurCH[j].horiz == beat_moves[i].horiz)
        if (OurCH[j].vertic == beat_moves[i].vertic) {
          brfl = true;
          break;
        }
    //есть ли в полях шашки оппонента?:
    for (var j = 0; j < EnCH.length; j++) 
      if (EnCH[j].horiz == beat_moves[i].horiz)
        if (EnCH[j].vertic == beat_moves[i].vertic) {
          brfl = true;
          break;
        }
    if (brfl == true) {
      beat_moves.splice(i,1);
      i--;
      brfl = false;
    }
  }
  console.log('Potential enemy checkers:', enemy_check);
  return [beat_moves, enemy_check];
}

//проверка доступности ударного хода дамки:
function beat_move_Q_check(OurCH, EnCH, checker) {
  var beat_moves = []; //список ударных ходов
  var enemy_check = []; //вспомогательный список полей с шашкой оппонента
  var brfl = false; //вспомогательный флаг прерывания записи в список
  var enfl = false; //флаг нахождения шашки оппонента
  var count = 0; //номер в списке ходов
  var countEn = 0; //номер в списке полей с шашкорй оппонента
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
          enfl = true; //если да, то активируется флаг нахождения шашки оппонента
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
  console.log('Potential enemy checkers:', enemy_check);
  return [beat_moves, enemy_check];
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
  if (checker.horiz > move.horiz) {
    h1 = move.horiz+1; //h1 всегда нижняя горизонталь
    h2 = checker.horiz-1; //h2 - верхняя
    c++;
  }
  else {
    h1 = checker.horiz+1;
    h2 = move.horiz-1;
  }
  if (checker.vertic > move.vertic) {
    v1 = move.vertic+1; //v1 всегда левая вертикаль
    v2 = checker.vertic-1; //v2 - правая
    c++;
  }
  else {
    v1 = checker.vertic+1;
    v2 = move.vertic-1;
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
  if (movedChecker.isQueen == true) [moves,] = beat_move_Q_check(OurCH, EnCH, movedChecker);
  else [moves,] = beat_move_not_Q_check(OurCH, EnCH, movedChecker);
  if (moves.length > 0) bfl = true;
  console.log('Player can make another beat move?:', bfl);
  return moves; //вывод ходов, если они имеются
}


//пост запрос в начале хода для различных проверок
app.post('/turn_begin', (req, res) => {
  active_color = []; //массив шашек текущего игрока
  inactive_color = []; //массив шашек другого игрока
  moves = []; //массив доступных ходов выбранной шашки
//Валидация цвета
  if (color_chCh == "white") {
    active_color = checkers.white; //запись всех элементов с цветом white в первый массив
    inactive_color = checkers.black; //black во второй массив
  }
  else if (color_chCh == "black") {
    active_color = checkers.black; //тут все наоборот
    inactive_color = checkers.white;
  }
  else {
    statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
    res.status(400).send(statuscode);
    return;
  }
  //проверка на возможность игроком нанести ударный ход
  for (var i = 0; i < active_color.length; i++) {
    active_color[i].color = color_chCh;
    if (active_color[i].isQueen == true) 
      [moves,] = beat_move_Q_check(active_color, inactive_color, active_color[i]);
    else [moves,] = beat_move_not_Q_check(active_color, inactive_color, active_color[i]);
    if (moves.length > 0) {
      BeatFlag = true;
      break;
    }
  }
  console.log('Player can make a beat move?:', BeatFlag);
  statuscode = ({ status: "ok" });
  res.status(200).send(statuscode);
  return;
})

//При выполнении пост запроса мы выполняем перемещение шашки и возвращаем статус выполнения
app.post('/', (req, res) => {
  //полученый в гет запросе json разбивают на локальные перменные
  //console.log('Coordinates of', color_chCh, 'will be changed:\nfrom:', 
  //h_chCh, v_chCh, '\nto:', new_h_Ch, new_v_Ch);

//Провести валидацию, возможно ли двинуть шашку на это место
var movedChecker = chosen_ch;
var active_color = []; //массив шашек текущего игрока
var inactive_color = []; //массив шашек другого игрока
var moves = []; //массив доступных ходов выбранной шашки
var potential_enemies = []; //массив потеницальных шашек оппонента на сьедение
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

  //тест функций проверок тихих и ударных ходов выбранной шашки:
  if (BeatFlag == true) {
    if (isQ_chCh == true) {
      [moves, potential_enemies] = beat_move_Q_check(active_color, inactive_color, chosen_ch);
    }
    else {
      [moves, potential_enemies] = beat_move_not_Q_check(active_color, inactive_color, chosen_ch);
    }
  }
  else {
    if (isQ_chCh == true) {
      moves = reg_move_Q_check(active_color, inactive_color, chosen_ch);
    }
    else {
      moves = reg_move_not_Q_check(active_color, inactive_color, chosen_ch);
    }
  }
  console.log('Available moves of this checker are:\n', moves); //вывод списка ходов в консоль

  //console.log('Coordinates of checkers of current player:\n',
  //'Before:', JSON.stringify(active_color, ['horiz', 'vertic'])); //вывод в консоль текущих координат
  //перемещаемой шашки
  //Ищем шашку и меняем параметры
  for (var i = 0; i < active_color.length; i++) {
    if (active_color[i].horiz == h_chCh)
      if (active_color[i].vertic == v_chCh) 
      {
        //Функция валидации хода
        var valid_move = false; //false - ход запрещен, true - ход разрешен
        for (var j = 0; j < moves.length; j++)
          if (moves[j].horiz == new_h_Ch)
            if (moves[j].vertic == new_v_Ch)
            valid_move = true;
        if (valid_move == true) {
          //если валидация пройдена, то шашка перемещается на новые координаты:
          active_color[i].horiz = new_h_Ch;
          active_color[i].vertic = new_v_Ch;
          if (BeatFlag == true)
            inactive_color = beating(chosen_ch, move_ch, inactive_color);
          console.log('Enemy checkers after beating move:', inactive_color);
          movedChecker.horiz = new_h_Ch;
          movedChecker.vertic = new_v_Ch;
          //проверка на то, дошла или шашка до последней горизонтали
          var Qfl = can_turn_Q_check(movedChecker.color, movedChecker);
            if (Qfl)
              //если да, то она сразу превращается в дамку
              movedChecker.isQueen = true;
          console.log('Parameters of moved checker:', JSON.stringify(movedChecker));
          //далее создаем обнавленные данные об игровой доске:
          if (color_chCh == "white") {
            checkers_ch = {
              white: active_color,
              black: inactive_color
            }
          }
          else 
          if (color_chCh == "black") {
            checkers_ch = {
              white: inactive_color,
              black: active_color
            }
          }
          else {
            statuscode = { status: "error: invalid color" }; //вывод ошибки если цвет неправильный
            res.status(400).send(statuscode);
            return;
          }
          //Вернуть статус-код выполнения задачи
          statuscode = ({ status: "ok" });
          res.status(200).send(statuscode);
          //console.log(checkers_ch);
          return;
        }
        else {
          //console.log(' After: No changes');
          //Вернуть статус-код ошибки выбора новых координат
          statuscode = ({ status: "error: this move is not valid" });
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