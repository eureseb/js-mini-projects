'use strict';

let btnCheck = document.querySelector('.check');
let btnAgain = document.getElementById('again');

let currGuess = document.querySelector('.guess');
let body = document.querySelector('body');
let score = document.getElementById('score');
let message = document.getElementById('message');
let highScore = document.getElementById('high-score');
let number = document.getElementById('number');

const randomNumberGenerator = () => {
  return Math.floor(Math.random() * 20) + 1;
};
const setHighScore = score => {
  highScore.innerHTML = score;
};
const setMessage = status => {
  let msg;
  switch (status) {
    case 'correct':
      msg = `Correct!!`;
      break;
    case 'too-high':
      msg = `Go lower!`;
      break;
    case 'too-low':
      msg = `Go higher!`;
      break;
    case 'reset':
      msg = `Start guessing...`;
      break;
    case 'out-of-bounds':
      msg = 'Out of bounds! (1-20)';
      break;
    case 'lost':
      msg = `You lost the game...`;
      break;
    default:
      msg = `Input a number.`;
      break;
  }
  message.innerHTML = msg;
};
const setBGColor = gameStatus => {
  body.style.backgroundColor = 'red';
  switch (gameStatus) {
    case 'correct':
      body.style.backgroundColor = 'green';
      break;
    case 'incorrect':
      body.style.backgroundColor = 'orange';
      break;
    case 'reset':
      body.style.backgroundColor = '#222';
      break;
    case 'lost':
      body.style.backgroundColor = 'blue';
      break;
    default:
      body.style.backgroundColor = 'grey';
  }
};
const disableElem = elem => {
  elem.disabled = true;
};
let correctAnswer = randomNumberGenerator();
console.log(correctAnswer);

btnCheck.addEventListener('click', function () {
  const value = currGuess.value;
  const currScore = score.innerHTML;
  if (currScore > 1) {
    if (value > 20 || (value < 1 && value != '')) {
      setMessage('out-of-bounds');
      currScore--;
    } else if (value == correctAnswer) {
      // CORRECT ANSWER
      if (currScore > highScore.innerHTML) setHighScore(currScore); // works
      setBGColor('correct'); // works
      setMessage('correct'); // works
      disableElem(btnCheck); // works
      disableElem(currGuess); // works
      number.innerHTML = correctAnswer;
      number.style.color = 'green';
    } else {
      if (value == '') {
        setMessage();
        setBGColor();
      } else if (value > correctAnswer) {
        setMessage('too-high');
        setBGColor('incorrect');
      } else {
        setMessage('too-low');
        setBGColor('incorrect');
      }
      number.innerHTML = '!';
      number.style.color = 'red';
      score.innerHTML--; // works
    }
  } else {
    setMessage('lost');
    setBGColor('lost');
    if (score.innerHTML > 0) score.innerHTML--;
    number.innerHTML = '☠';
  }
});

btnAgain.addEventListener('click', function () {
  correctAnswer = randomNumberGenerator();
  setBGColor('reset');
  setMessage('reset');
  score.innerHTML = 20;
  currGuess.value = '';
  btnCheck.disabled = false;
  currGuess.disabled = false;

  console.log(correctAnswer);
});
