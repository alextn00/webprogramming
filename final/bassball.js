var question = [];
var count = 0;
var formArea = document.getElementById("formArea");
var inputList = formArea.getElementsByTagName("input");
var tbodyArea = document.getElementById("tbodyArea");
var trList = tbodyArea.getElementsByTagName("tr");

var answer = document.getElementById('answer');
var number_chance = document.getElementById('chance_count');
var number_count = 0;
const MAX_COUNT = 9;

/*  ─────────────────────  메세지 설정  ─────────────────────  */
var notice = {
    notOne: "한 칸에 숫자를 하나씩 입력하세요.",
    notNumber: "숫자가 아닙니다.",
    repeated: "같은 숫자가 이미 있습니다. 다른 숫자를 입력하세요.",
    correct: "정답입니다.",
    incorrect: "틀렸습니다. 새 게임을 진행하세요."
};

/*  ────────────────────  메세지 팝업창  ────────────────────  */
function alertWindow(message) { // "alert()" 대신에, 팝업창을 만듦

    var text = "<p>" + message + "</p><br />";
    text += "<button onclick=' self.close() '> 창 닫기 </button>"; // Close button. 

    var bodyStyle = "font-family: sans-serif; font-size: 12px; text-align: center;";

    var winStyle = "width=300,height=100,resizable=0,status=0,toolbar=0,menubar=0,location=0,scrollbars=0";

    var alertWin = window.open("", "_blank", winStyle);
    alertWin.document.body.innerHTML = text;
    alertWin.document.body.style.cssText = bodyStyle;
}

/*  ───────────────────   문제 출제용 함수   ───────────────────  */
function setQuestion(lengths) {

    var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    array.sort(function () { return Math.random() * this.length });

    return array.slice(0, lengths);
}

/*  ─────────────────────  재시작용  ─────────────────────  */
function reStarting() {
    count = 0; question = []; number_count = 0;
    number_chance.innerHTML = " ";
}

/*  ───────────────────   게임 진행할 함수   ───────────────────  */
function playOneRound(tagList) {

    var lengths = tagList.length;
    if (count == 0) {
        while (question.length < lengths) question = setQuestion(lengths);
    }

    var guess = [];
    var bulls = cows = 0;
    var final;

    for (var x = 0; x < lengths; x++) { guess[x] = tagList[x].value; }

    var questionText = question.join().replace(/,/g, "");
    var guessText = guess.join().replace(/,/g, "");

    for (var x = 0; x < lengths; x++) {

        var tag = tagList[x];
        var value = tag.value.replace(/ /g, "");

        var position = guessText.search(value);

        if (!value || value > 9) {
            tag.select();
            return alertWindow(notice.notOne);
        }
        else if (isNaN(value)) {
            tag.select();
            return alertWindow(notice.notNumber);
        }
        else if (position > -1 && position != x) {
            tag.select();
            return alertWindow(notice.repeated);
        }

        position = questionText.search(value);

        if (position == x) { bulls += 1; }
        else if (position > -1) { cows += 1; }
    }

    if (bulls < lengths && count == 8) { final = notice.incorrect }
    else if (bulls == lengths) { return alertWindow(notice.correct) }

    questionText = question.join(", ");
    guessText = guess.join(", ");

    var score = {
        count: count,
        bulls: bulls,
        cows: cows,
        question: questionText,
        guess: guessText,
        final: final
    };

    if (final) { reStarting(); }
    else { count++; }

    number_count++;
    number_chance.innerHTML = MAX_COUNT - number_count;
    return score;
}

function bullsAndCows() {

    var result = playOneRound(inputList);

    if (result == undefined) return;

    var strikes = result.bulls;
    var balls = result.cows;
    var roundScore = strikes + " 스트라이크 │ " + balls + " 볼";

    var count = result.count;
    if (count == 0) { deleteText(); }

    var question = result.question;
    var guess = result.guess;

    var tr = trList[count];

    var td1 = tr.getElementsByTagName("td")[1];
    var td2 = tr.getElementsByTagName("td")[2];

    td1.innerHTML = guess;
    td2.innerHTML = roundScore;

    var text = "";
    var final = result.final;

    if (final) {
        if (strikes < inputList.length) { text = final + "정답은 " + question + " 입니다."; }
        else { text = final; }
    }

    formArea.reset();
    inputList[0].focus();
    answer.innerHTML = text;
}

/*  ──────────────────  마우스 커서, 자동 이동  ──────────────────  */
function changeFocus(tag, next, event) {

    event = event || window.event;

    var keyCode = event.which || event.keyCode;

    if (keyCode == 8 || keyCode == 46) { return; }

    else if (tag.value.length == 1) { inputList[next].select(); }
}

inputList[0].onkeyup = function (e) { changeFocus(this, 1, e) };
inputList[1].onkeyup = function (e) { changeFocus(this, 2, e) };

if (inputList[3] != undefined) {
    inputList[2].onkeyup = function (e) { changeFocus(this, 3, e) };
}

/*  ─────────────────────    리셋 효과   ─────────────────────  */
function deleteText() {
    inputList[0].focus();

    for (var x = 0; x < trList.length; x++) {

        var tr = trList[x];
        var tdList = tr.getElementsByTagName("td");

        tdList[1].innerHTML = "&nbsp;";
        tdList[2].innerHTML = "&nbsp;";
    }
}