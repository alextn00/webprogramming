const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
let lastHole;
let timeUp = false;
let timeover = 20000; //20s
let score = 0;
var button = document.getElementById('button');

//create a function to make a random time for mole to pop from the hole
function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];

    //prevent same hole from getting the same number
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(500, 1000); //get a random time to determine how long mole should peep
    const hole = randomHole(holes); //get the random hole from the randomHole function
    hole.classList.add('up'); //add the CSS class so selected mole can "pop up"
    setTimeout(() => {
        hole.classList.remove('up'); //make the selected mole "pop down" after a random time
        if (!timeUp) {
            peep();
        }
    }, time);
}

function startGame() {
    scoreBoard.textContent = 0;
    score = 0;
    timeUp = false;
    peep();
    setTimeout(() => timeUp = true, timeover)
    setTimeout(() => finish(), timeover);
}

function wack(e) {
    if (!e.isTrusted) return;
    score++;
    this.parentNode.classList.remove('up')  //this refers to item clicked
    scoreBoard.textContent = score;

}

function finish() {
    alert("게임 종료!!\n" + score + "점 입니다!");
}

moles.forEach(mole => mole.addEventListener('click', wack))