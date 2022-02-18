'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
// const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
// const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnReset = document.querySelector('.btn--reset');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Creating User Accounts
let createUserName = accounts => {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name.at(0))
      .join('');
  });
};
//Init User accounts;
createUserName(accounts);
// console.log(accounts);

//Display Account movements;
const calcBalance = function (movements) {
  return movements.reduce((acc, mov) => acc + mov, 0);
};
const calcIn = function (movements) {
  return movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
};
const calcOut = function (movements) {
  return movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
};
const calcInterest = function (acc) {
  return acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
};
const displayMovements = function (movements, def = true, isSorted = false) {
  containerMovements.innerHTML = '';

  let movs = movements;

  if (!def) {
    movs = isSorted
      ? movements.slice().sort((a, b) => a - b)
      : movements.slice().sort((a, b) => b - a);
  }

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    let html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = function (acc) {
  const balance = calcBalance(acc.movements);
  acc.balance = balance;
  labelBalance.textContent = `${balance}`;
};

const calcDisplaySummary = function (acc) {
  console.log(acc.movements);
  const income = calcIn(acc.movements);
  const out = calcOut(acc.movements);
  const interest = calcInterest(acc); //Need full account deets because of interesRate + movements;

  labelSumIn.textContent = `${income}`;
  labelSumOut.textContent = `${Math.abs(out)}`;
  labelSumInterest.textContent = `${interest}`;
};
const updateUi = function (acc) {
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputLoanAmount.value = '';
  inputLoginPin.blur();
  displayMovements(acc.movements);
  displayBalance(acc);
  calcDisplaySummary(acc);
};

let currentAccount;
//Btns
//Logging in
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin == Number(inputLoginPin.value)) {
    // console.log('hello');
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Clear fields

    updateUi(currentAccount);
  }
});
//Transfering
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 && //Amount should be positive
    recieverAccount && //Reciever account exists
    currentAccount.balance >= amount && //Balance is atleast equal to the transfer amount
    currentAccount.username !== recieverAccount //Current logged in user not equal to recipient.
  ) {
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);
    updateUi(currentAccount);
  }
});

//Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
  }
});
//Delete Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    updateUi();
    containerApp.style.opacity = 0;
  }
});
//Sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, false, !sorted);
  sorted = !sorted;
  btnSort.textContent = sorted ? `⬆ Sort` : `⬇ Sort`;
});

btnReset.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements);
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// const eurToUsd = 1.1;

// const movementsUSD = movements.map(mov => (mov * eurToUsd).toFixed(2));

// const movementsDesc = movements.map(
//   (mov, i) =>
//     `Withdrew ${i + 1}: You ${mov > 0 ? `deposited` : `withdraw`} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementsDesc);
