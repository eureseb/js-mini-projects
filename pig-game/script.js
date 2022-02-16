'use strict';
//HTML Elements
const p1TotalElem = document.getElementById('score--0');
const p1CurrElem = document.getElementById('current--0');
const p2TotalElem = document.getElementById('score--1');
const p2CurrElem = document.getElementById('current--1');
const diceElem = document.querySelector('.dice');

//Buttons
const btnNewGame = document.querySelector('.btn--new');
const btnRollDice = document.querySelector('.btn--roll');
const btnHoldDice = document.querySelector('.btn--hold');

//Helper Functions
const randomNumberGen = () => Math.floor(Math.random() * 6) + 1;
const resetScore = elem => (elem.textContent = 0);
const hideDice = () => diceElem.classList.add('hidden');
const showDice = () => diceElem.classList.remove('hidden');
const diceFace = face => (diceElem.src = `/dice-${face}.png`);

//Player States
let currentPlayer = 1;
const changePlayer = () => (currentPlayer = currentPlayer ? 0 : 1);

//Current Die value + roll streak
let val = 0;
let rolls = 0;

//Start game defaults
resetScore(p1TotalElem);
resetScore(p1CurrElem);
resetScore(p2TotalElem);
resetScore(p2CurrElem);
hideDice();

//Main functionality of the game.
const rollDice = () => {
  let num = randomNumberGen();
  rolls += 1;
  showDice();
  diceFace(num);

  //You lose your turn if you roll a "1".
  //Anything else, you can continue rolling.
  if (num == 1) {
    val = 0;
    holdDice();
  } else val += num;

  if (currentPlayer == 0) p1CurrElem.innerHTML = val;
  else p2CurrElem.innerHTML = val;
};

const holdDice = () => {
  //Check if hold dice was double-pressed
  if (rolls != 0) {
    if (currentPlayer == 0) {
      p1TotalElem.innerHTML = Number(p1TotalElem.innerHTML) + Number(val);
      resetScore(p1CurrElem);
    } else if (currentPlayer == 1) {
      p2TotalElem.innerHTML = Number(p2TotalElem.innerHTML) + Number(val);
      resetScore(p2CurrElem);
    }
    val = 0;
    hideDice();
    changePlayer();
  }
  //Reset roll streak
  rolls = 0;
};

//Start new game
const newGame = () => {
  //Curr Dice Val
  val = 0;
  //Total Scores
  resetScore(p1TotalElem);
  resetScore(p2TotalElem);
  //Current Scores
  resetScore(p1CurrElem);
  resetScore(p2CurrElem);
  //Hide Dice
  hideDice();
};

btnRollDice.addEventListener('click', rollDice);
btnHoldDice.addEventListener('click', holdDice);
btnNewGame.addEventListener('click', newGame);
