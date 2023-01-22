//подключенные библеотеки
const express = require('express');
const XMLHttpRequest = require('xhr2');

const hostname = '127.0.0.1';
const port = 3030;
const serv_port = 80;

const server_ip_address = "85.143.223.149" //ip сервера БД
const server_port = 2020 //порт сервера БД

const app = express();
app.use(express.json());

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

//инициализация начала хода
function initTurnBegin(req, callback) { //initTurnBegin(req, function() {...})
    try { //валидация успешна
    var cur_ses = req.body.current_session;
    var json = JSON.stringify({"current_session": cur_ses});
    const request = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже
    //request.open("POST", `http://${server_ip_address}:${serv_port}/ru_turn_begin`); //гет запрос на сервер
    request.open("POST", `http://localhost:${serv_port}/ru_turn_begin`); 
    request.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса
    request.send(json); //хз
    request.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
        if (request.response) {
            var checkersWmoves = JSON.parse(request.response); //получаем список шашек с ходами
            console.log('initTurnBegin_ok'); //вывод в консоль
            console.log('Bot can move checker(s):', checkersWmoves); //вывод в консоль
            callback(checkersWmoves); 
        }
        else {
            //список шашек не пришел
            console.log('initTurnBegin_no_response'); //вывод в консоль
            callback();
        }
    }
    }
    catch {
        console.log('initTurnBegin_err'); //вывод в консоль
        return 0; //подозрительное преобразование типов
    }
}

//инициализация поиска доступных ходов у рандомно выбранной шашки с ходами
function initAvailableMoves(req, callback) { //initAvailableMoves(req, function() {...})
    initTurnBegin(req, function(checkersWmoves) {
        if(checkersWmoves){
            //выбираем случайный номер шашки:
            var c = Math.floor(Math.random()*checkersWmoves.length);
            chosenCh = checkersWmoves[c];
            console.log('Bot has chosen a checker:', chosenCh);
            try { //валидация успешна
                var cur_ses = req.body.current_session;
                var json = JSON.stringify({"current_session": cur_ses,
                "color": chosenCh.color, "horiz": chosenCh.horiz,
                "vertic": chosenCh.vertic, "isQueen": chosenCh.isQueen});
                const request = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже
                //request.open("POST", `http://${server_ip_address}:${server_port}/ru_available_moves`); //гет запрос на сервер
                request.open("POST", `http://localhost:${serv_port}/ru_available_moves`); 
                request.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса
                request.send(json); //хз
                request.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
                    if (request.response) {
                        //пришел список ходов
                        var moves = JSON.parse(request.response);
                        console.log('initAvailableMoves_ok'); //вывод в консоль
                        console.log('Bot can move this checker to:', moves); //вывод в консоль
                        callback(moves, chosenCh); 
                    }
                    else {
                        //список ходов не пришел
                        console.log('initAvailableMoves_no_response'); //вывод в консоль
                        callback();
                    }
                }
                }
            catch {
                console.log('initAvailableMoves_err'); //вывод в консоль
                return 0; //подозрительное преобразование типов
            }
        }
    })
}

//инициализация выбора рандомного хода
function initMove(req, callback) { //initMove(req, function() {...})
    initAvailableMoves(req, function(moves, chosenCh) {
        if(moves){
            //выбираем случайный ход случайной шашки:
            var c = Math.floor(Math.random()*moves.length);
            chosenMove = moves[c];
            console.log('Bot has chosen this move:', chosenMove); //вывод в консоль
            try { //валидация успешна
                var cur_ses = req.body.current_session;
                var json = JSON.stringify({"current_session": cur_ses,
                "color": chosenCh.color, "horiz": chosenCh.horiz,
                "vertic": chosenCh.vertic, "isQueen": chosenCh.isQueen,
                "new_horiz": chosenMove.horiz, "new_vertic": chosenMove.vertic});
                const request = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже
                //request.open("POST", `http://${server_ip_address}:${server_port}/ru_move`); //гет запрос на сервер
                request.open("POST", `http://localhost:${serv_port}/ru_move`); 
                request.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса
                request.send(json); //хз
                request.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
                    if (request.response) {
                        //пришли данные о перемещенной шашке
                        var movedChecker = JSON.parse(request.response);
                        console.log('initMove_ok'); //вывод в консоль
                        console.log('checker info after move:', movedChecker); //вывод в консоль
                        callback(movedChecker); 
                    }
                    else {
                        //список ходов не пришел
                        console.log('initMove_no_response'); //вывод в консоль
                        callback();
                    }
                }
                }
            catch {
                console.log('initMove_err'); //вывод в консоль
                return 0; //подозрительное преобразование типов
            }
        }
    })
}

//инициализация действий после хода
function initAfterMove(req, callback) { //initAfterMove(req, function() {...})
    initMove(req, function(movedCh) {
        if(movedCh){
            try { //валидация успешна
                var cur_ses = req.body.current_session;
                var json = JSON.stringify({"current_session": cur_ses,
                "color": movedCh.color, "horiz": movedCh.horiz,
                "vertic": movedCh.vertic, "isQueen": movedCh.isQueen});
                const request = new XMLHttpRequest(); //специальная переменная для работы с команадами ниже
                //request.open("POST", `http://${server_ip_address}:${server_port}/ru_after_move`); //гет запрос на сервер
                request.open("POST", `http://localhost:${serv_port}/ru_after_move`); 
                request.setRequestHeader('Content-Type', 'application/json'); //параметры Хэдера запроса
                request.send(json); //хз
                request.onload = (e) => { //как только придет ответ функция будет работать с пришедшими значениями
                    if (request.response) {
                        //пришли данные о перемещенной шашке
                        var statuscode = JSON.parse(request.response);
                        console.log('initAfterMove_ok'); //вывод в консоль
                        console.log('Info after move:', statuscode); //вывод в консоль
                        callback(statuscode); 
                    }
                    else {
                        //список ходов не пришел
                        console.log('initAfterMove_no_response'); //вывод в консоль
                        callback();
                    }
                }
                }
            catch {
                console.log('initAfterMove_err'); //вывод в консоль
                return 0; //подозрительное преобразование типов
            }
        }
    })
}

app.post('/bot_moves', (req, res) => {
extractCheckers(req, function(checkers) {
    extractActiveColor(req, function(active_color) {
        const request = new XMLHttpRequest();
        active_Ch = []; //массив шашек бота
        moves = []; //массив доступных ходов выбранной шашки
        var statuscode; //статус код, который будет отправлен в ответ к серверу
        //Валидация цвета
        if (active_color == "white") active_Ch = checkers.white;
        else if (active_color == "black") active_Ch = checkers.black;
        else {
            statuscode = { status: "error: no such color" }; //вывод ошибки если цвет неправильный
            res.status(400).send(statuscode);
            return;
        }
        initAfterMove(req, function(statuscode) {
            res.status(200).send(statuscode);
            return;
        })
    })
})
})

app.listen(port, () => { //бот запущен
    console.log(`Bot is active on port ${port}`)
  })